import { getCryptoImplementation } from "./crypto.mjs"
import { defaultOptions } from "./options.mjs"
import { makeDeferredPromise } from "./promise.mjs"
import { getWebsocketImplementation } from "./websocket.mjs"

export const makeClient = (options) => {
    const fullOptions = {
        ...defaultOptions,
        ...options
    }

    const self = {
        websocketImplementation: null,
        cryptoImplementation: null,

        socket: null,
        requests: {},
        
        options: fullOptions,
        isOpen: false,
        isAuthed: false,
        
        init: async () => undefined,
        onOpen: () => undefined,
        onClose: () => undefined,
        onError: () => undefined,
        onMessage: () => undefined,
        reload: () => undefined,
        request: async (action, value) => undefined,
        publish: (visualisationId, value) => undefined,
    }
    self.init = init(self)
    self.onOpen = onOpen(self)
    self.onClose = onClose(self)
    self.onError = onError(self)
    self.onMessage = onMessage(self)
    self.reload = reload(self)
    self.request = request(self)
    self.publish = publish(self)
    
    return {
        init: self.init,
        publish: self.publish
    }
}

const init = (self) => async () => {
    if (!self.websocketImplementation) {
        self.websocketImplementation = await getWebsocketImplementation()
    }

    if (!self.cryptoImplementation) {
        self.cryptoImplementation = await getCryptoImplementation()
    }

    self.socket = new self.websocketImplementation(self.options.url)
    self.socket.addEventListener('open', self.onOpen)
    self.socket.addEventListener('close', self.onClose)
    self.socket.addEventListener('error', self.onError)
    self.socket.addEventListener('message', self.onMessage)
    
    await new Promise(resolve => self.socket.addEventListener('open', () => resolve()))
    const response = await self.request('tokens-login', self.options.auth)

    if ('reason' in response) {
        throw new Error(response.reason)
    }

    self.isAuthed = true
}

const onOpen = (self) => () => {
    self.isOpen = true
}

const onClose = (self) => () => {
    self.isOpen = false
    self.socket.close()
    self.reload()
}

const onError = (self) => () => {
    self.isOpen = false
    self.socket.close()
    self.reload()
}

const onMessage = (self) => (message) => {
    const parsedMessage = JSON.parse(message.data)
    const deferredPromiseResolve = self.requests[parsedMessage.requestId]

    if (!deferredPromiseResolve) {
        return
    }

    deferredPromiseResolve(parsedMessage?.data)
}

const reload = (self) => () => {
    if (self.timer) {
        clearTimeout(self.timer)
    }

    self.socket.remove('open', self.onOpen)
    self.socket.remove('close', self.onClose)
    self.socket.remove('error', self.onError)
    self.socket.remove('message', self.onMessage)

    self.timer = setTimeout(
        () => self.init(),  
        self.options.reconnectTimeout
    )
}

const request = (self) => async (action, data) => {
    if (!self.socket || !self.isOpen) {
        throw new Error('Not ready')
    }

    const message = {
        action,
        requestId: self.cryptoImplementation.randomUUID(),
        data
    }
    const promise = makeDeferredPromise()
    
    self.requests[message.requestId] = promise.resolve
    self.socket.send(JSON.stringify(message))

    return promise.promise
}

const publish = (self) => async (visualisationId, value) => {
    if (!self.socket || !self.isOpen || !self.isAuthed) {
        throw new Error('Not ready')
    }

    const message = {
        action: 'data-create',
        requestId: undefined,
        data: {
            visualisationId,
            value
        }
    }

    self.socket.send(JSON.stringify(message))
}

