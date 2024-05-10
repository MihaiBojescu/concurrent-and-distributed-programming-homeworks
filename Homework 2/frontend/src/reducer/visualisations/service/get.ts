import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Visualisation, VisualisationsActions, VisualisationsError, VisualisationsGetAction, VisualisationsGetFailedAction, VisualisationsGetStartedAction, VisualisationsGetSuccessAction, VisualisationsState } from "../types";

export const getVisualisationHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    getVisualisation: {
        ...state.getVisualisation,
        fetching: true,
        error: null
    },
});

export const getVisualisationStartedHandler = (state: VisualisationsState, action: VisualisationsGetStartedAction): VisualisationsState => ({
    ...state,
    getVisualisation: {
        ...state.getVisualisation,
        requests: {
            ...state.getVisualisation.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    },
});

export const getVisualisationSuccessHandler = (state: VisualisationsState, action: VisualisationsGetSuccessAction): VisualisationsState => {
    const original = state.data[action.data.projectId] || [action.data.data]
    const existingVisualisationIndex = original.findIndex(item => item.visualisation_id === action.data.data.visualisation_id);
    const copy = original.slice()

    if (existingVisualisationIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingVisualisationIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.getVisualisation.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: copy
        },
        getVisualisation: {
            ...state.getVisualisation,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        },
    };
};

export const getVisualisationFailedHandler = (state: VisualisationsState, action: VisualisationsGetFailedAction): VisualisationsState => {
    const requestsCopy = { ...state.getVisualisation.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getVisualisation: {
            ...state.getVisualisation,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        },
    }
}

export const getVisualisationSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsGetAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-visualisation-started', data: { requestId } })

            const result = await websocket.request<{ visualisation: Visualisation } | VisualisationsError>('visualisations-get', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'get-visualisation-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-visualisation-success', data: { requestId, projectId: action.data.projectId, data: result.visualisation } })
        } catch (error) {
            dispatch({ type: 'get-visualisation-failed', data: { requestId, reason: error as string } })
        }
    }

