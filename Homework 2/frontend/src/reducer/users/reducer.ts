import React from 'react'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { createUserFailedHandler, createUserHandler, createUserSideEffect, createUserSuccessHandler } from './service/create'
import { hydrateFailedHandler, hydrateSideEffect, hydrateSuccessHandler } from './service/hydrate'
import { loginFailedHandler, loginHandler, loginSideEffect, loginSuccessHandler, loginSuccessfulSideEffect } from './service/login'
import { UsersActions, UsersState } from './types'


export const usersInitialState: UsersState = ({
    loading: true,
    login: {
        fetching: false,
        error: null,
        data: {
            isAuthenticated: false,
            user: null,
            tokens: null
        }
    },
    createUser: {
        fetching: false,
        error: null,
        data: null
    }
})

export const usersReducer: React.Reducer<UsersState, UsersActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-success':
            return hydrateSuccessHandler(action)
        case 'hydrate-failed':
            return hydrateFailedHandler(state)
        case 'login':
            return loginHandler(state)
        case 'login-success':
            return loginSuccessHandler(state, action)
        case 'login-failed':
            return loginFailedHandler(state, action)
        case 'create-user':
            return createUserHandler(state)
        case 'create-user-success':
            return createUserSuccessHandler(state, action)
        case 'create-user-failed':
            return createUserFailedHandler(state, action)
        default:
            return state
    }
}

export const usersSideEffects =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<UsersState, UsersActions>> => {
        const boundHydrate = hydrateSideEffect()
        const boundLogin = loginSideEffect(websocket)
        const boundLoginSuccess = loginSuccessfulSideEffect()
        const boundCreateUser = createUserSideEffect(websocket)

        return (state, action, dispatch) => {
            switch (action.type) {
                case 'hydrate':
                    return boundHydrate(state, action, dispatch)
                case 'login':
                    return boundLogin(state, action, dispatch)
                case 'login-success':
                    return boundLoginSuccess(state, action, dispatch)
                case 'create-user':
                    return boundCreateUser(state, action, dispatch)
            }
        }
    }
