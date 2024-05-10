import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects"
import { ManagedWebSocket } from "../../../hooks/useWebSockets"
import { DataState, DataActions, DataCreateAction, Data, DataError, DataCreateSuccessAction, DataCreateFailedAction, DataCreateStartedAction } from "../types"

export const createDataHandler = (state: DataState, action: DataCreateAction): DataState => ({
    ...state,
    createData: {
        ...state.createData,
        fetching: true,
        error: null
    }
})

export const createDataStartedHandler = (state: DataState, action: DataCreateStartedAction): DataState => ({
    ...state,
    createData: {
        ...state.createData,
        requests: {
            ...state.createData.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
})

export const createDataSuccessHandler = (state: DataState, action: DataCreateSuccessAction): DataState => {
    const original = state.data[action.data.visualisationId] || [action.data.data]
    const existingDataIndex = original.findIndex(item => item.data_id === action.data.data.data_id);
    const copy = original.slice()
    
    if (existingDataIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingDataIndex, 1, action.data.data)
    }

    if (copy.length > 200) {
        copy.splice(0, copy.length - 200)
    }

    const requestsCopy = { ...state.createData.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.visualisationId]: copy
        },
        createData: {
            ...state.createData,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
}

export const createDataFailedHandler = (state: DataState, action: DataCreateFailedAction): DataState => {
    const requestsCopy = { ...state.createData.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        createData: {
            ...state.createData,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    });
}

export const createDataSideEffect =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<DataState, DataActions>, DataCreateAction> =>
        async (state, action, dispatch) => {
            const requestId = window.crypto.randomUUID()
            
            try {
                dispatch({ type: 'create-data-started', data: { requestId } })
                
                const result = await websocket.request<{ data: Data } | DataError>('create-data', action.data)

                if ('reason' in result) {
                    return dispatch({ type: 'create-data-failed', data: { requestId, reason: result.reason } })
                }

                dispatch({ type: 'create-data-success', data: { requestId, visualisationId: action.data.visualisationId, data: result.data } })
            } catch (error) {
                dispatch({ type: 'create-data-failed', data: { requestId, reason: error as string } })
            }
        }
