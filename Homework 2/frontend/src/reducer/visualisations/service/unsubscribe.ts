import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { VisualisationsActions, VisualisationsCreateUnsubscribeAction, VisualisationsCreateUnsubscribeFailedAction, VisualisationsCreateUnsubscribeStartedAction, VisualisationsCreateUnsubscribeSuccessAction, VisualisationsState } from "../types";

export const createVisualisationUnsubscribeHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    createVisualisationsUnsubscribe: {
        ...state.createVisualisationsUnsubscribe,
        fetching: true,
        error: null
    }
});

export const createVisualisationUnsubscribeStartedHandler = (state: VisualisationsState, action: VisualisationsCreateUnsubscribeStartedAction): VisualisationsState => ({
    ...state,
    createVisualisationsUnsubscribe: {
        ...state.createVisualisationsUnsubscribe,
        requests: {
            ...state.createVisualisationsUnsubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const createVisualisationUnsubscribeSuccessHandler = (
    state: VisualisationsState,
    action: VisualisationsCreateUnsubscribeSuccessAction
) => {
    const copy = { ...state.subscriptions };
    delete copy[action.data.projectId];

    const requestsCopy = { ...state.createVisualisationsUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        subscriptions: copy,
        createVisualisationsUnsubscribe: {
            ...state.createVisualisationsUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    };
};

export const createVisualisationUnsubscribeFailedHandler = (
    state: VisualisationsState,
    action: VisualisationsCreateUnsubscribeFailedAction
): VisualisationsState => {
    const requestsCopy = { ...state.createVisualisationsUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createVisualisationsUnsubscribe: {
            ...state.createVisualisationsUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
}

export const createVisualisationUnsubscribeSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsCreateUnsubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-visualisation-unsubscribe-started', data: { requestId } })
            await state.subscriptions[action.data.projectId]?.unsubscribe()
            dispatch({ type: 'create-visualisation-unsubscribe-success', data: { requestId, projectId: action.data.projectId } })
        } catch (error) {
            dispatch({ type: 'create-visualisation-unsubscribe-failed', data: { requestId, reason: error as string } })
        }
    }

