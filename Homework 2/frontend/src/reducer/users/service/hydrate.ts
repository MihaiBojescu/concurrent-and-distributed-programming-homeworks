import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import {
    UsersActions,
    UsersHydrateAction,
    UsersHydrateSuccessfulAction,
    UsersState
} from "../types";

export const hydrateSuccessHandler = (action: UsersHydrateSuccessfulAction): UsersState => ({
    ...action.data,
    loading: false,
    login: {
        ...action.data.login,
        error: null,
        fetching: false
    },
    createUser: {
        ...action.data.createUser,
        error: null,
        fetching: false
    }
});

export const hydrateFailedHandler = (state: UsersState): UsersState => ({
    ...state,
    loading: false,
    login: {
        ...state.login,
        error: null,
        fetching: false
    },
    createUser: {
        ...state.createUser,
        error: null,
        fetching: false
    }
});

export const hydrateSideEffect = (): ReducerSideEffect<React.Reducer<UsersState, UsersActions>, UsersHydrateAction> => (state, action, dispatch) => {
    try {
        const rawState = localStorage.getItem('auth-reducer')

        if (!rawState) {
            return dispatch({ type: 'hydrate-failed' })
        }

        const state = JSON.parse(rawState)
        delete state.isAuthenticated

        dispatch({ type: 'hydrate-success', data: state })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}

