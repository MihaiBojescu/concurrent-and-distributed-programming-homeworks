import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { TokensActions, TokensCreateUnsubscribeAction, TokensCreateUnsubscribeFailedAction, TokensCreateUnsubscribeStartedAction, TokensCreateUnsubscribeSuccessAction, TokensState } from "../types";

export const createTokenUnsubscribeHandler = (state: TokensState): TokensState => ({
    ...state,
    createTokensUnsubscribe: {
        ...state.createTokensUnsubscribe,
        fetching: true,
        error: null
    }
});

export const createTokenUnsubscribeStartedHandler = (state: TokensState, action: TokensCreateUnsubscribeStartedAction): TokensState => ({
    ...state,
    createTokensUnsubscribe: {
        ...state.createTokensUnsubscribe,
        requests: {
            ...state.createTokensUnsubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const createTokenUnsubscribeSuccessHandler = (state: TokensState, action: TokensCreateUnsubscribeSuccessAction) => {
    const copy = { ...state.subscriptions };
    delete copy[action.data.projectId];
    const requestsCopy = { ...state.createTokensSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        subscriptions: copy,
        createTokensUnsubscribe: {
            ...state.createTokensUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    };
};

export const createTokenUnsubscribeFailedHandler = (state: TokensState, action: TokensCreateUnsubscribeFailedAction): TokensState => {
    const requestsCopy = { ...state.createTokensSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createTokensUnsubscribe: {
            ...state.createTokensUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
};

export const createTokenUnsubscribeSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensCreateUnsubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-token-unsubscribe-started', data: { requestId } })
            await state.subscriptions[action.data.projectId]?.unsubscribe()
            dispatch({ type: 'create-token-unsubscribe-success', data: { requestId, projectId: action.data.projectId } })
        } catch (error) {
            dispatch({ type: 'create-token-unsubscribe-failed', data: { requestId, reason: error as string } })
        }
    }

