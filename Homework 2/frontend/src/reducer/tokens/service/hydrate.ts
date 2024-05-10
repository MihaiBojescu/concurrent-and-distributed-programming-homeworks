import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { TokensActions, TokensHydrateAction, TokensHydrateSuccessfulAction, TokensState } from "../types";

export const hydrateSuccessHandler = (action: TokensHydrateSuccessfulAction): TokensState => ({
    ...action.data,
    loading: false,
    getTokens: {
        ...action.data.getTokens,
        error: null,
        fetching: false
    },
    getToken: {
        ...action.data.getToken,
        error: null,
        fetching: false
    }
});

export const hydrateFailedHandler = (state: TokensState): TokensState => ({
    ...state,
    loading: false,
    getTokens: {
        ...state.getTokens,
        error: null,
        fetching: false
    },
    getToken: {
        ...state.getToken,
        error: null,
        fetching: false
    }
});

export const hydrateSideEffect = (): ReducerSideEffect<React.Reducer<TokensState, TokensActions>, TokensHydrateAction> => (state, action, dispatch) => {
    try {
        const data = localStorage.getItem('tokens-reducer')

        if (!data) {
            return dispatch({ type: 'hydrate-failed' })
        }

        dispatch({ type: 'hydrate-success', data: JSON.parse(data) })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}

