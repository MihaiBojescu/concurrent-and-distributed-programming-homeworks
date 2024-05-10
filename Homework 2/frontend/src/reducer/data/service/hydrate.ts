import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects"
import { DataActions, DataHydrateAction, DataHydrateFailedAction, DataHydrateSuccessfulAction, DataState } from "../types"

export const hydrateSuccessHandler = (state: DataState, action: DataHydrateSuccessfulAction): DataState => ({
    ...action.data,
    loading: false,
    getData: {
        ...action.data.getData,
        fetching: false,
        error: null
    },
    createData: {
        ...action.data.createData,
        fetching: false,
        error: null
    }
})

export const hydrateFailedHandler = (state: DataState, action: DataHydrateFailedAction): DataState => ({
    ...state,
    loading: false,
    getData: {
        ...state.getData,
        fetching: false,
        error: null
    },
    createData: {
        ...state.createData,
        fetching: false,
        error: null
    }
})

export const hydrateSideEffect = (): ReducerSideEffect<React.Reducer<DataState, DataActions>, DataHydrateAction> => (state, action, dispatch) => {
    try {
        const data = localStorage.getItem('data-reducer')

        if (!data) {
            return dispatch({ type: 'hydrate-failed' })
        }

        dispatch({ type: 'hydrate-success', data: JSON.parse(data) })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}
