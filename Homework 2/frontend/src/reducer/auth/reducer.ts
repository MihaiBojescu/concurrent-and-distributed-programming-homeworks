import React from 'react'
import { AuthActions, AuthError, AuthHydrateAction, AuthLoginAction, AuthLoginSuccessAction, AuthState, Tokens, User } from './types'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'


export const authInitialState: AuthState = ({
    loading: true,
    fetching: false,
    isAuthenticated: false,
    error: null,
    tokens: null,
    user: null
})

export const authReducer: React.Reducer<AuthState, AuthActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-successful':
            return {
                ...action.state,
                loading: false,
                fetching: false
            }
        case 'hydrate-failed':
            return {
                ...state,
                loading: false,
                fetching: false
            }
        case 'login':
            return {
                ...state,
                fetching: true
            }
        case 'login-success':
            return {
                ...state,
                fetching: false,
                isAuthenticated: true,
                error: null,
                tokens: action.tokens,
                user: action.user
            }
        case 'login-failed':
            return {
                ...state,
                fetching: false,
                isAuthenticated: false,
                error: action.error,
                tokens: null,
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
                case 'hydrate':
                    return hidrate(state, action, dispatch)
                case 'login':
                    return boundLogin(state, action, dispatch)
                case 'login-success':
                    return loginSuccessful(state, action, dispatch)
            }
        }
    }

const hidrate: ReducerSideEffect<React.Reducer<AuthState, AuthActions>, AuthHydrateAction> = (state, action, dispatch) => {
    try {
        const data = localStorage.getItem('auth-reducer')

        if (!data) {
            return dispatch({ type: 'hydrate-failed' })
        }

        dispatch({ type: 'hydrate-successful', state: JSON.parse(data) })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}


const login =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<AuthState, AuthActions>, AuthLoginAction> =>
        async (state, action, dispatch) => {
            try {
                const result = await websocket.request<{ user: User, tokens: Tokens } | AuthError>('login', action.credentials)

                if ('cause' in result) {
                    return dispatch({ type: 'login-failed', error: result.cause })
                }

                dispatch({ type: 'login-success', user: result.user, tokens: result.tokens })
            } catch (error) {
                dispatch({ type: 'login-failed', error: error as string })
            }
        }


const loginSuccessful: ReducerSideEffect<React.Reducer<AuthState, AuthActions>, AuthLoginSuccessAction> = async (state, action, dispatch) => {
    localStorage.setItem(
        'auth-reducer',
        JSON.stringify({
            ...state,
            isAuthenticated: true,
            user: action.user,
            tokens: action.tokens
        })
    )
}