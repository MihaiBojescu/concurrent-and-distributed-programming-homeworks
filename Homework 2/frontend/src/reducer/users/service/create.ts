import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Tokens, User, UsersActions, UsersCreateUserAction, UsersCreateUserFailedAction, UsersCreateUserSuccessAction, UsersError, UsersState } from "../types";

export const createUserHandler = (state: UsersState): UsersState => ({
    ...state,
    createUser: {
        ...state.createUser,
        fetching: true
    }
});

export const createUserSuccessHandler = (state: UsersState, action: UsersCreateUserSuccessAction): UsersState => ({
    ...state,
    createUser: {
        ...state.createUser,
        fetching: false,
        error: null,
        data: action.data
    }
});

export const createUserFailedHandler = (state: UsersState, action: UsersCreateUserFailedAction): UsersState => ({
    ...state,
    createUser: {
        ...state.createUser,
        fetching: false,
        error: action.data,
        data: null
    }
});

export const createUserSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<UsersState, UsersActions>, UsersCreateUserAction> =>
    async (state, action, dispatch) => {
        try {
            const result = await websocket.request<{ user: User; tokens: Tokens}  | UsersError>('users-create', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'create-user-failed', data: result.reason })
            }

            dispatch({ type: 'create-user-success', data: result.user })
        } catch (error) {
            dispatch({ type: 'create-user-failed', data: (error as Error).message })
        }
    }

