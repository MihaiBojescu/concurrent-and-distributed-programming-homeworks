import React from 'react'
import { AuthActions, AuthError, AuthLoginAction, AuthState, User } from './types'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'


export const authInitialState: AuthState = ({
    fetching: false,
    authenticated: false,
    error: null,
    user: null
})

export const authReducer: React.Reducer<AuthState, AuthActions> = (state, action) => {
    switch (action.type) {
        case 'login':
            return {
                ...state,
                fetching: true
            }
        case 'login-success':
            return {
                ...state,
                fetching: false,
                authenticated: true,
                error: null,
                user: action.user
            }
        case 'login-failed':
            return {
                ...state,
                fetching: false,
                authenticated: false,
                error: action.error,
                user: null
            }
        default:
            return state
    }
}

export const authSideEffects =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<AuthState, AuthActions>> => {
        const boundLogin = login(websocket)

        return (state, action, dispatch) => {
            switch (action.type) {
                case 'login':
                    return boundLogin(state, action, dispatch)
            }
        }
    }


const login =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<AuthState, AuthActions>, AuthLoginAction> =>
        async (state, action, dispatch) => {
            try {
                const result = await websocket.request<User | AuthError>('login', action.credentials)

                if ('cause' in result) {
                    return dispatch({ type: 'login-failed', error: result.cause })
                }

                dispatch({ type: 'login-success', user: result })
            } catch (error) {
                dispatch({ type: 'login-failed', error: error as string })
            }
        }