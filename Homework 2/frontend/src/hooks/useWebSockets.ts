import { useCallback, useEffect, useRef, useState } from "react"
import { makeDeferredPromise, DeferredPromise } from "../utils/promise"
import { useTimeout } from "./useTimeout"

type Message<T> = {
    action: string
    requestId: undefined | string
    data: T
}
type RequestListener<T, U> = {
    request: {
        requestId: string
        action: string
        data: U
    },
    callback: DeferredPromise<T>
}
type SubscriptionListener<T, U> = {
    subscription: {
        action: string
        data: U
    },
    callback: SubscriptionCallback<T>
}
type SubscriptionCallback<T> = (data: T) => void

export type Subscription = {
    unsubscribe(): Promise<void>
}

export type ManagedWebSocket = {
    connected: boolean
    request<R, T = unknown>(action: string, data: T): Promise<R>,
    publish<T>(action: string, data: T): void,
    subscribe<T, U = null>(action: string, data: U, callback: SubscriptionCallback<T>): Promise<Subscription>
}

export const useWebSockets = (url: string, timeout: number): ManagedWebSocket => {
    const [messages, setMessages] = useState<Record<string, Message<any>[]>>({})
    const [requests, setRequests] = useState<Record<string, Message<any>>>({})
    const [requestListeners, setRequestListeners] = useState<Record<string, RequestListener<any, any>>>({})
    const [subscriptionListeners, setSubscriptionListeners] = useState<Record<string, SubscriptionListener<any, any>[]>>({})

    const { handleMessage } = useMessageQueueManager(
        requests,
        setRequests,
        messages,
        setMessages,
        requestListeners,
        subscriptionListeners,
    )
    const { resubscribe } = useSubscriptionManager({
        subscriptionListeners,
        subscribe: (action, data, callback) => {
            internalSubscribe(action, data, callback)
        }
    })
    const { retry } = useRequestManager({
        requestListeners,
        retry: (requestId, action, data) => {
            internalRequest(requestId, action, data)
        }
    })
    const { socket, connected, connectedRef } = useManagedWebsocket({
        url,
        timeout,
        handleOpen: () => {
            retry()
            resubscribe()
        },
        handleMessage: (event) => {
            handleMessage(event)
        },
    })

    const internalRequest = <T, R>(requestId: string, action: string, data: T) => {
        if (!socket.current || !connectedRef.current) {
            throw new Error('Socket not connected')
        }

        const existingRequestListener = requestListeners[requestId]

        if (existingRequestListener) {
            socket.current.send(JSON.stringify(existingRequestListener.request))
            return existingRequestListener.callback
        }

        const request = { requestId, action, data }
        const requestListener = { request, callback: makeDeferredPromise<R>() }

        socket.current.send(JSON.stringify(request))
        setRequestListeners(previousValue => ({
            ...previousValue,
            [requestId]: requestListener
        }))

        return requestListener.callback
    }

    const request = async <T, R>(action: string, data: T): Promise<R> => {
        if (!socket.current || !connectedRef.current) {
            throw new Error('Socket not connected')
        }

        const requestId = crypto.randomUUID()
        const requestListener = internalRequest(requestId, action, data)

        const then = Date.now()
        const result = await requestListener.promise
        console.log('action', action, Date.now()-then)

        return result
    }

    const publish = <T>(action: string, data: T) => {
        if (!socket.current || !connectedRef.current) {
            return
        }

        socket.current.send(JSON.stringify({
            action,
            requestId: undefined,
            data
        }))
    }

    const internalSubscribe = async <T, U = null>(action: string, data: U, callback: SubscriptionCallback<T>) => {
        if (!socket.current || !connectedRef.current) {
            throw new Error('Socket not connected')
        }

        const subscription = { action, data }
        const subscriptionListener = { subscription, callback }
        setSubscriptionListeners(previousValue => ({
            ...previousValue,
            [action]:
                !previousValue[action]
                    ? [subscriptionListener]
                    : [...previousValue[action], subscriptionListener]
        }))

        await request(`${action}-subscribe`, data || null)

        return subscriptionListener
    }

    const subscribe = async <T, U = null>(action: string, data: U, callback: SubscriptionCallback<T>) => {
        if (!socket.current || !connectedRef.current) {
            throw new Error('Socket not connected')
        }

        const subscription = await internalSubscribe(action, data, callback)

        return {
            unsubscribe: unsubscribe(subscription)
        }
    }

    const unsubscribe = <T, U>(subscription: SubscriptionListener<T, U>) => async () => {
        if (!socket.current || !connectedRef.current) {
            throw new Error('Socket not connected')
        }

        await request(`${subscription.subscription.action}-unsubscribe`, null)

        const index = subscriptionListeners[subscription.subscription.action].findIndex(entry => entry === subscription)

        if (index === -1) {
            return
        }

        setSubscriptionListeners(previousValue => {
            const subscriptions = (previousValue[subscription.subscription.action] || []).slice()
            subscriptions.splice(index, 1)

            return {
                ...previousValue,
                [subscription.subscription.action]: subscriptions
            }
        })
    }

    return {
        connected,
        request,
        publish,
        subscribe
    }
}

const useManagedWebsocket = (opts: {
    url: string,
    timeout: number,
    handleOpen?: () => void,
    handleClose?: () => void,
    handleError?: () => void,
    handleMessage?: (event: MessageEvent) => void
}) => {
    const socket = useRef<WebSocket | undefined>()
    const [connected, setConnected] = useState(false)
    const connectedRef = useRef(false)

    const internalHandleOpen = () => {
        setConnected(true)
        opts.handleOpen?.()
    }

    const internalHandleClose = () => {
        setConnected(false)
        interval.end()
        interval.start()
        opts.handleClose?.()
    }

    const internalHandleError = () => {
        setConnected(false)
        interval.end()
        interval.start()
        opts.handleError?.()
    }

    const internalHandleMessage = (event: MessageEvent) => {
        opts.handleMessage?.(event)
    }

    const interval = useTimeout(
        opts.timeout,
        () => {
            if (socket.current) {
                socket.current.close()

                socket.current.removeEventListener('open', internalHandleOpen)
                socket.current.removeEventListener('close', internalHandleClose)
                socket.current.removeEventListener('error', internalHandleError)
                socket.current.removeEventListener('message', internalHandleMessage);
            }

            socket.current = new WebSocket(opts.url)

            socket.current.addEventListener('open', internalHandleOpen)
            socket.current.addEventListener('close', internalHandleClose)
            socket.current.addEventListener('error', internalHandleError)
            socket.current.addEventListener('message', internalHandleMessage);
        },
        [internalHandleOpen, internalHandleClose, internalHandleError, internalHandleMessage]
    )

    useEffect(() => {
        socket.current = new WebSocket(opts.url)

        socket.current.addEventListener('open', internalHandleOpen)
        socket.current.addEventListener('close', internalHandleClose)
        socket.current.addEventListener('error', internalHandleError)
        socket.current.addEventListener('message', internalHandleMessage);
    }, [])

    useEffect(() => {
        connectedRef.current = connected
    }, [connected])

    return { socket, connected, connectedRef }
}


const useMessageQueueManager = (
    requests: Record<string, Message<any>>,
    setRequests: React.Dispatch<React.SetStateAction<Record<string, Message<any>>>>,
    messages: Record<string, Message<any>[]>,
    setMessages: React.Dispatch<React.SetStateAction<Record<string, Message<any>[]>>>,
    requestListeners: Record<string, RequestListener<any, any>>,
    subscriptionListeners: Record<string, SubscriptionListener<any, any>[]>
) => {
    const handleMessage = useCallback((event: MessageEvent) => {
        const message = JSON.parse(event.data) as Message<any>
        const requestId = message.requestId
        const messageAction = message.action

        if (requestId) {
            return setRequests(requests => {
                const requestsCopy = { ...requests }
                requestsCopy[requestId] = message
                return requestsCopy
            })
        }

        return setMessages(messages => {
            const messagesCopy = { ...messages }

            if (!(messageAction in messagesCopy)) {
                messagesCopy[messageAction] = []
            }

            messagesCopy[messageAction].push(message)
            return messagesCopy
        })
    }, [])

    useEffect(() => {
        if (Object.values(requests).length > 0) {
            const requestsCopy = { ...requests }

            for (const [requestId, messageEntry] of Object.entries(requestsCopy)) {
                const listener = requestListeners[requestId]

                if (listener) {
                    listener.callback.resolve(messageEntry.data)
                }

                delete requestsCopy[requestId]
            }

            setRequests(requestsCopy)
        }

        if (Object.values(messages).length > 0) {
            const messagesCopy = { ...messages }

            for (const [messageAction, messageEntries] of Object.entries(messagesCopy)) {
                const listeners = subscriptionListeners[messageAction]

                if (!listeners || listeners.length === 0) {
                    delete messagesCopy[messageAction]
                    continue
                }

                for (const message of messageEntries) {
                    for (const listener of listeners) {
                        listener.callback(message.data)
                    }
                }

                delete messagesCopy[messageAction]
            }

            setMessages(messagesCopy)
        }
    }, [requests, messages, subscriptionListeners, requestListeners, setMessages, setRequests])

    return { handleMessage }
}

const useSubscriptionManager = (opts: {
    subscriptionListeners: Record<string, SubscriptionListener<any, any>[]>,
    subscribe: <T, U = null>(action: string, data: U, callback: SubscriptionCallback<T>) => void
}) => {
    const resubscribe = useCallback(() => {
        for (const subscriptionListeners of Object.values(opts.subscriptionListeners)) {
            for (const subscriptionListener of subscriptionListeners) {
                opts.subscribe(subscriptionListener.subscription.action, subscriptionListener.subscription.data, subscriptionListener.callback)
            }
        }
    }, [opts.subscriptionListeners])

    return { resubscribe }
}

const useRequestManager = (opts: {
    requestListeners: Record<string, RequestListener<any, any>>
    retry: <U = null>(requestId: string, action: string, data: U) => void
}) => {
    const retry = useCallback(() => {
        for (const requestListener of Object.values(opts.requestListeners)) {
            opts.retry(requestListener.request.requestId, requestListener.request.action, requestListener.request.data)
        }
    }, [opts.requestListeners])

    return { retry }
}