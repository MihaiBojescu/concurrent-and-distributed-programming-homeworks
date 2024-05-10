import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Visualisation, VisualisationsActions, VisualisationsCreateSubscribeAction, VisualisationsCreateSubscribeFailedAction, VisualisationsCreateSubscribeStartedAction, VisualisationsCreateSubscribeSuccessAction, VisualisationsError, VisualisationsState } from "../types";

export const createVisualisationSubscribeHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    createVisualisationsSubscribe: {
        ...state.createVisualisationsSubscribe,
        fetching: true,
        error: null
    }
});

export const createVisualisationSubscribeStartedHandler = (state: VisualisationsState, action: VisualisationsCreateSubscribeStartedAction): VisualisationsState => ({
    ...state,
    createVisualisationsSubscribe: {
        ...state.createVisualisationsSubscribe,
        requests: {
            ...state.createVisualisationsSubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const createVisualisationSubscribeSuccessHandler = (
    state: VisualisationsState,
    action: VisualisationsCreateSubscribeSuccessAction
): VisualisationsState => {
    const requestsCopy = { ...state.createVisualisationsSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        subscriptions: {
            ...state.subscriptions,
            [action.data.projectId]: action.data.subscription
        },
        createVisualisationsSubscribe: {
            ...state.createVisualisationsSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
}

export const createVisualisationSubscribeFailedHandler = (
    state: VisualisationsState,
    action: VisualisationsCreateSubscribeFailedAction
): VisualisationsState => {
    const requestsCopy = { ...state.createVisualisationsSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createVisualisationsSubscribe: {
            ...state.createVisualisationsSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
}

export const createVisualisationSubscribeSideEffect = (
    websocket: ManagedWebSocket,
    additionalSubscriptions: (visualisation: Visualisation) => void
): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsCreateSubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-visualisation-subscribe-started', data: { requestId } })

            const result = await websocket.subscribe<{ visualisation: Visualisation } | VisualisationsError, VisualisationsCreateSubscribeAction['data']>('visualisations-create', action.data, (message) => {
                if ('reason' in message) {
                    return
                }

                dispatch({ type: 'create-visualisation-success', data: { requestId: '', projectId: message.visualisation.project_id, data: message.visualisation } })
                additionalSubscriptions(message.visualisation)
            })

            dispatch({ type: 'create-visualisation-subscribe-success', data: { requestId, projectId: action.data.projectId, subscription: result } })
        } catch (error) {
            dispatch({ type: 'create-visualisation-subscribe-failed', data: { requestId, reason: error as string } })
        }
    }

