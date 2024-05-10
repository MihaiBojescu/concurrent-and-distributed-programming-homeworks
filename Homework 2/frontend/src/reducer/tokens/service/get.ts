import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Token, TokensActions, TokensError, TokensGetAction, TokensGetFailedAction, TokensGetStartedAction, TokensGetSuccessAction, TokensState } from "../types";

export const getTokenHandler = (state: TokensState): TokensState => ({
    ...state,
    getToken: {
        ...state.getToken,
        fetching: true,
        error: null
    }
});

export const getTokenStartedHandler = (state: TokensState, action: TokensGetStartedAction): TokensState => ({
    ...state,
    getToken: {
        ...state.getToken,
        requests: {
            ...state.getToken.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const getTokenSuccessHandler = (state: TokensState, action: TokensGetSuccessAction): TokensState => {
    const original = state.data[action.data.projectId] || [action.data.data]
    const existingTokenIndex = original.findIndex(item => item.token_id === action.data.data.token_id);
    const copy = original.slice()

    if (existingTokenIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingTokenIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.getToken.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: copy
        },
        getToken: {
            ...state.getToken,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    };
};

export const getTokenFailedHandler = (state: TokensState, action: TokensGetFailedAction): TokensState => {
    const requestsCopy = { ...state.getToken.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getToken: {
            ...state.getToken,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
};

export const getTokenSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensGetAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-token-started', data: { requestId } })

            const result = await websocket.request<{ token: Token } | TokensError>('tokens-get', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'get-token-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-token-success', data: { requestId, projectId: action.data.projectId, data: result.token } })
        } catch (error) {
            dispatch({ type: 'get-token-failed', data: { requestId, reason: error as string } })
        }
    }

