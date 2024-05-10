import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Tokens, User, UsersActions, UsersError, UsersLoginAction, UsersLoginFailedAction, UsersLoginSuccessAction, UsersState } from "../types";

export const loginHandler = (state: UsersState): UsersState => ({
    ...state,
    login: {
        ...state.login,
        fetching: true
    }
});

export const loginSuccessHandler = (state: UsersState, action: UsersLoginSuccessAction): UsersState => ({
    ...state,
    login: {
        ...state.login,
        fetching: false,
        error: null,
        data: {
            ...state.login.data,
            isAuthenticated: true,
            tokens: action.data.tokens,
            user: action.data.user
        }
    }
});

export const loginFailedHandler = (state: UsersState, action: UsersLoginFailedAction): UsersState => ({
    ...state,
    login: {
        ...state.login,
        fetching: false,
        error: action.data,
        data: {
            ...state.login.data,
            isAuthenticated: false,
            tokens: null,
            user: null
        }
    }
});

export const loginSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<UsersState, UsersActions>, UsersLoginAction> =>
    async (state, action, dispatch) => {
        try {
            const result = await websocket.request<{ user: User; tokens: Tokens}  | UsersError>('users-login', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'login-failed', data: result.reason })
            }

            dispatch({ type: 'login-success', data: { user: result.user, tokens: result.tokens } })
        } catch (error) {
            dispatch({ type: 'login-failed', data: (error as Error).message })
        }
    }

export const loginSuccessfulSideEffect = (): ReducerSideEffect<React.Reducer<UsersState, UsersActions>, UsersLoginSuccessAction> => async (state, action, dispatch) => {
    const updatedUserState: UsersState = {
        ...state,
        login: {
            fetching: false,
            error: null,
            data: {
                isAuthenticated: false,
                user: action.data.user,
                tokens: action.data.tokens,
            }
        }
    }

    localStorage.setItem(
        'auth-reducer',
        JSON.stringify(updatedUserState)
    )
}
