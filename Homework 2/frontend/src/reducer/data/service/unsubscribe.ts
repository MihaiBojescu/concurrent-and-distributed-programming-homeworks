import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects"
import { ManagedWebSocket } from "../../../hooks/useWebSockets"
import { DataActions, DataCreateUnsubscribeAction, DataCreateUnsubscribeFailedAction, DataCreateUnsubscribeStartedAction, DataCreateUnsubscribeSuccessAction, DataState } from "../types"

export const createDataUnsubscribeHandler = (state: DataState, action: DataCreateUnsubscribeAction): DataState => ({
    ...state,
    createDataUnsubscribe: {
        ...state.createDataUnsubscribe,
        fetching: true,
        error: null,
    }
})

export const createDataUnsubscribeStartedHandler = (state: DataState, action: DataCreateUnsubscribeStartedAction): DataState => ({
    ...state,
    createDataUnsubscribe: {
        ...state.createDataUnsubscribe,
        requests: {
            ...state.createDataUnsubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
})

export const createDataUnsubscribeSuccessHandler = (state: DataState, action: DataCreateUnsubscribeSuccessAction): DataState => {
    const copy = { ...state.subscriptions }
    delete copy[action.data.visualisationId]
    const requestsCopy = { ...state.createDataUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        subscriptions: copy,
        createDataUnsubscribe: {
            ...state.createDataUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
}

export const createDataUnsubscribeFailedHandler = (state: DataState, action: DataCreateUnsubscribeFailedAction): DataState => {
    const requestsCopy = { ...state.createDataUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createDataUnsubscribe: {
            ...state.createDataUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason,
        }
    }
}


export const createDataUnsubscribeSideEffect =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<DataState, DataActions>, DataCreateUnsubscribeAction> =>
        async (state, action, dispatch) => {
            const requestId = window.crypto.randomUUID()

            try {
                dispatch({ type: 'create-data-unsubscribe-started', data: { requestId } })
                await state.subscriptions[action.data.visualisationId]?.unsubscribe()
                dispatch({ type: 'create-data-unsubscribe-success', data: { requestId, visualisationId: action.data.visualisationId } })
            } catch (error) {
                dispatch({ type: 'create-data-unsubscribe-failed', data: { requestId, reason: error as string } })
            }
        }
