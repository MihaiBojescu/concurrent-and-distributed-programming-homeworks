import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Visualisation, VisualisationsActions, VisualisationsCreateAction, VisualisationsCreateFailedAction, VisualisationsCreateStartedAction, VisualisationsCreateSuccessAction, VisualisationsError, VisualisationsState } from "../types";

export const createVisualisationHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    createVisualisation: {
        ...state.createVisualisation,
        fetching: true,
        error: null
    },
});

export const createVisualisationStartedHandler = (state: VisualisationsState, action: VisualisationsCreateStartedAction): VisualisationsState => ({
    ...state,
    createVisualisation: {
        ...state.createVisualisation,
        requests: {
            ...state.createVisualisation.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    },
});

export const createVisualisationSuccessHandler = (state: VisualisationsState, action: VisualisationsCreateSuccessAction): VisualisationsState => {
    const original = state.data[action.data.projectId] || [action.data.data]
    const existingVisualisationIndex = original.findIndex(item => item.visualisation_id === action.data.data.visualisation_id);
    const copy = original.slice()

    if (existingVisualisationIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingVisualisationIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.createVisualisation.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: copy
        },
        createVisualisation: {
            ...state.createVisualisation,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        },
    };
};

export const createVisualisationFailedHandler = (state: VisualisationsState, action: VisualisationsCreateFailedAction): VisualisationsState => {
    const requestsCopy = { ...state.createVisualisation.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createVisualisation: {
            ...state.createVisualisation,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        },
    }
}

export const createVisualisationSideEffect = (
    websocket: ManagedWebSocket,
    additionalSubscriptions: (visualisation: Visualisation) => void
): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsCreateAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-visualisation-started', data: { requestId } })

            const result = await websocket.request<{ visualisation: Visualisation } | VisualisationsError>('visualisations-create', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'create-visualisation-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'create-visualisation-success', data: { requestId, projectId: action.data.projectId, data: result.visualisation } })
            dispatch({ type: 'create-visualisation-subscribe', data: { projectId: action.data.projectId } })
        } catch (error) {
            dispatch({ type: 'create-visualisation-failed', data: { requestId, reason: error as string } })
        }
    }

