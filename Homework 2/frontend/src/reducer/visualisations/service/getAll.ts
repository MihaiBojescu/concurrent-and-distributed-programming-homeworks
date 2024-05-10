import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Visualisation, VisualisationsActions, VisualisationsError, VisualisationsGetAllAction, VisualisationsGetAllFailedAction, VisualisationsGetAllStartedAction, VisualisationsGetAllSuccessAction, VisualisationsState } from "../types";

export const getAllVisualisationsHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    getAllVisualisations: {
        ...state.getAllVisualisations,
        fetching: true,
        error: null
    },
});

export const getAllVisualisationsStartedHandler = (state: VisualisationsState, action: VisualisationsGetAllStartedAction): VisualisationsState => ({
    ...state,
    getAllVisualisations: {
        ...state.getAllVisualisations,
        requests: {
            ...state.getAllVisualisations.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    },
});

export const getAllVisualisationsSuccessHandler = (state: VisualisationsState, action: VisualisationsGetAllSuccessAction): VisualisationsState => {
    const requestsCopy = { ...state.getAllVisualisations.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: action.data.data
        },
        getAllVisualisations: {
            ...state.getAllVisualisations,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        },
    }
}

export const getAllVisualisationsFailedHandler = (state: VisualisationsState, action: VisualisationsGetAllFailedAction): VisualisationsState => {
    const requestsCopy = { ...state.getAllVisualisations.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getAllVisualisations: {
            ...state.getAllVisualisations,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason,
        },
    }
}

export const getAllVisualisationsSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsGetAllAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-all-visualisations-started', data: { requestId } })

            const result = await websocket.request<{ visualisations: Visualisation[] } | VisualisationsError>('visualisations-get-all', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'get-all-visualisations-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-all-visualisations-success', data: { requestId, projectId: action.data.projectId, data: result.visualisations } })
        } catch (error) {
            dispatch({ type: 'get-all-visualisations-failed', data: { requestId, reason: error as string } })
        }
    }
