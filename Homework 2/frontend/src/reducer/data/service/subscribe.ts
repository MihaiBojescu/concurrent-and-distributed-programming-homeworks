import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects"
import { ManagedWebSocket } from "../../../hooks/useWebSockets"
import { DataState, DataActions, DataCreateSubscribeAction, Data, DataError, DataCreateSubscribeSuccessAction, DataCreateSubscribeFailedAction, DataCreateSubscribeStartedAction } from "../types"

export const createDataSubscribeHandler = (state: DataState, action: DataCreateSubscribeAction): DataState => ({
    ...state,
    createDataSubscribe: {
        ...state.createDataSubscribe,
        fetching: true,
        error: null
    }
})

export const createDataSubscribeStartedHandler = (state: DataState, action: DataCreateSubscribeStartedAction): DataState => ({
    ...state,
    createDataSubscribe: {
        ...state.createDataSubscribe,
        requests: {
            ...state.createDataSubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
})

export const createDataSubscribeSuccessHandler = (state: DataState, action: DataCreateSubscribeSuccessAction): DataState => {
    const requestsCopy = { ...state.createDataSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        subscriptions: {
            ...state.subscriptions,
            [action.data.visualisationId]: action.data.subscription
        },
        createDataSubscribe: {
            ...state.createDataSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null
        }
    })
}

export const createDataSubscribeFailedHandler = (state: DataState, action: DataCreateSubscribeFailedAction): DataState => {
    const requestsCopy = { ...state.createDataSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        createDataSubscribe: {
            ...state.createDataSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    })
}

export const createDataSubscribeSideEffect =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<DataState, DataActions>, DataCreateSubscribeAction> =>
        async (state, action, dispatch) => {
            const requestId = window.crypto.randomUUID()
            
            try {
                dispatch({ type: 'create-data-subscribe-started', data: { requestId } })

                const result = await websocket.subscribe<{ data: Data } | DataError, DataCreateSubscribeAction['data']>('data-create', action.data, (message) => {
                    if ('reason' in message) {
                        return
                    }

                    dispatch({ type: 'create-data-success', data: { requestId: '', visualisationId: message.data.visualisation_id, data: message.data } })
                })

                dispatch({ type: 'create-data-subscribe-success', data: { requestId, visualisationId: action.data.visualisationId, subscription: result } })
            } catch (error) {
                dispatch({ type: 'create-data-subscribe-failed', data: { requestId, reason: error as string } })
            }
        }
