import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Token, TokensActions, TokensError, TokensGetAllAction, TokensGetAllFailedAction, TokensGetAllStartedAction, TokensGetAllSuccessAction, TokensState } from "../types";

export const getAllTokensHandler = (state: TokensState): TokensState => ({
    ...state,
    getTokens: {
        ...state.getTokens,
        fetching: true,
        error: null
    }
});

export const getAllTokensStartedHandler = (state: TokensState, action: TokensGetAllStartedAction): TokensState => ({
    ...state,
    getTokens: {
        ...state.getTokens,
        requests: {
            ...state.createToken.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null,
    }
});

export const getAllTokensSuccessHandler = (state: TokensState, action: TokensGetAllSuccessAction): TokensState => {
    const requestsCopy = { ...state.getTokens.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: action.data.data
        },
        getTokens: {
            ...state.getTokens,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
};

export const getAllTokensFailedHandler = (state: TokensState, action: TokensGetAllFailedAction): TokensState => {
    const requestsCopy = { ...state.getTokens.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getTokens: {
            ...state.getTokens,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason,
        }
    }
};

export const getAllTokensSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensGetAllAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-all-tokens-started', data: { requestId } })

            const result = await websocket.request<{ tokens: Token[] } | TokensError>('tokens-get-all', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'get-all-tokens-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-all-tokens-success', data: { requestId, projectId: action.data.projectId, data: result.tokens } })
        } catch (error) {
            dispatch({ type: 'get-all-tokens-failed', data: { requestId, reason: error as string } })
        }
    }

