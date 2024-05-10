import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Token, TokensActions, TokensCreateSubscribeAction, TokensCreateSubscribeFailedAction, TokensCreateSubscribeStartedAction, TokensCreateSubscribeSuccessAction, TokensError, TokensState } from "../types";

export const createTokenSubscribeHandler = (state: TokensState): TokensState => ({
    ...state,
    createTokensSubscribe: {
        ...state.createTokensSubscribe,
        fetching: true,
        error: null
    }
});

export const createTokenSubscribeStartedHandler = (state: TokensState, action: TokensCreateSubscribeStartedAction): TokensState => ({
    ...state,
    createTokensSubscribe: {
        ...state.createTokensSubscribe,
        requests: {
            ...state.createTokensSubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null,
    }
});

export const createTokenSubscribeSuccessHandler = (state: TokensState, action: TokensCreateSubscribeSuccessAction): TokensState => {
    const requestsCopy = { ...state.createTokensSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        subscriptions: {
            ...state.subscriptions,
            [action.data.projectId]: action.data.subscription
        },
        createTokensSubscribe: {
            ...state.createTokensSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    });
};

export const createTokenSubscribeFailedHandler = (state: TokensState, action: TokensCreateSubscribeFailedAction): TokensState => {
    const requestsCopy = { ...state.createTokensSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        createTokensSubscribe: {
            ...state.createTokensSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    });
};

export const createTokenSubscribeSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensCreateSubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-token-subscribe-started', data: { requestId } })

            const result = await websocket.subscribe<{ token: Token } | TokensError, TokensCreateSubscribeAction['data']>('tokens-create', action.data, (message) => {
                if ('reason' in message) {
                    return
                }

                dispatch({ type: 'create-token-success', data: { requestId: '', projectId: message.token.project_id, data: message.token } })
            })

            dispatch({ type: 'create-token-subscribe-success', data: { requestId, projectId: action.data.projectId, subscription: result } })
        } catch (error) {
            dispatch({ type: 'create-token-subscribe-failed', data: { requestId, reason: error as string } })
        }
    }

