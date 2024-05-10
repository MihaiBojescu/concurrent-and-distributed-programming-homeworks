import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Token, TokensActions, TokensCreateAction, TokensCreateFailedAction, TokensCreateStartedAction, TokensCreateSuccessAction, TokensError, TokensState } from "../types";

export const createTokenHandler = (state: TokensState): TokensState => ({
    ...state,
    createToken: {
        ...state.createToken,
        fetching: true,
        error: null
    }
});

export const createTokenStartedHandler = (state: TokensState, action: TokensCreateStartedAction): TokensState => ({
    ...state,
    createToken: {
        ...state.createToken,
        requests: {
            ...state.createToken.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const createTokenSuccessHandler = (state: TokensState, action: TokensCreateSuccessAction): TokensState => {
    const original = state.data[action.data.projectId] || [action.data.data]
    const existingTokenIndex = original.findIndex(item => item.token_id === action.data.data.token_id);
    const copy = original.slice()

    if (existingTokenIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingTokenIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.createToken.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: {
            ...state.data,
            [action.data.projectId]: copy
        },
        createToken: {
            ...state.createToken,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null
        }
    };
};

export const createTokenFailedHandler = (state: TokensState, action: TokensCreateFailedAction): TokensState => {
    const requestsCopy = { ...state.createToken.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createToken: {
            ...state.createToken,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
};

export const createTokenSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensCreateAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-token-started', data: { requestId } })

            const result = await websocket.request<{ token: Token } | TokensError>('tokens-create', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'create-token-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'create-token-success', data: { requestId, projectId: action.data.projectId, data: result.token } })
        } catch (error) {
            dispatch({ type: 'create-token-failed', data: { requestId, reason: error as string } })
        }
    }

