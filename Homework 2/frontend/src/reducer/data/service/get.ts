import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Data, DataActions, DataError, DataGetAction, DataGetFailedAction, DataGetStartedAction, DataGetSuccessAction, DataState } from "../types";

export const getDataHandler = (state: DataState, action: DataGetAction): DataState => ({
    ...state,
    getData: {
        ...state.getData,
        fetching: true,
        error: null
    }
})

export const getDataStartedHandler = (state: DataState, action: DataGetStartedAction): DataState => ({
    ...state,
    getData: {
        ...state.getData,
        requests: {
            ...state.getData.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
})

export const getDataSuccessHandler = (state: DataState, action: DataGetSuccessAction): DataState => {
    const requestsCopy = { ...state.getData.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        data: {
            ...state.data,
            [action.data.visualisationId]: action.data.data
        },
        getData: {
            ...state.getData,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    });
}

export const getDataFailedHandler = (state: DataState, action: DataGetFailedAction): DataState => {
    const requestsCopy = { ...state.getData.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getData: {
            ...state.getData,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
}

export const getDataSideEffect =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<DataState, DataActions>, DataGetAction> =>
        async (state, action, dispatch) => {
            const requestId = window.crypto.randomUUID()
          
            try {
                dispatch({ type: 'get-all-data-started', data: { requestId } })

                const result = await websocket.request<{ data: Data[] } | DataError>('data-get-all', { visualisationId: action.data.visualisationId })

                if ('reason' in result) {
                    return dispatch({ type: 'get-all-data-failed', data: { requestId, reason: result.reason } })
                }

                dispatch({ type: 'get-all-data-success', data: { requestId, visualisationId: action.data.visualisationId, data: result.data } })
            } catch (error) {
                dispatch({ type: 'get-all-data-failed', data: { requestId, reason: error as string } })
            }
        }
