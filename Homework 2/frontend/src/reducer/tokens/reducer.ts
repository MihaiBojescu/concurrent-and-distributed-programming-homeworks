import React from 'react'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { createTokenFailedHandler, createTokenHandler, createTokenSideEffect, createTokenStartedHandler, createTokenSuccessHandler } from './service/create'
import { getTokenFailedHandler, getTokenHandler, getTokenSideEffect, getTokenStartedHandler, getTokenSuccessHandler } from './service/get'
import { getAllTokensFailedHandler, getAllTokensHandler, getAllTokensSideEffect, getAllTokensStartedHandler, getAllTokensSuccessHandler } from './service/getAll'
import { hydrateFailedHandler, hydrateSideEffect, hydrateSuccessHandler } from './service/hydrate'
import { createTokenSubscribeFailedHandler, createTokenSubscribeHandler, createTokenSubscribeSideEffect, createTokenSubscribeStartedHandler, createTokenSubscribeSuccessHandler } from './service/subscribe'
import { createTokenUnsubscribeFailedHandler, createTokenUnsubscribeHandler, createTokenUnsubscribeSideEffect, createTokenUnsubscribeStartedHandler, createTokenUnsubscribeSuccessHandler } from './service/unsubscribe'
import { TokensActions, TokensState } from './types'


export const tokensInitialState: TokensState = ({
    loading: true,
    subscriptions: {},
    data: {},
    getTokens: {
        requests: {},
        fetching: false,
        error: null,
    },
    getToken: {
        requests: {},
        fetching: false,
        error: null,
    },
    createToken: {
        requests: {},
        fetching: false,
        error: null,
    },
    createTokensSubscribe: {
        requests: {},
        fetching: false,
        error: null,
    },
    createTokensUnsubscribe: {
        requests: {},
        fetching: false,
        error: null,
    }
})

export const tokensReducer: React.Reducer<TokensState, TokensActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-success':
            return hydrateSuccessHandler(action)
        case 'hydrate-failed':
            return hydrateFailedHandler(state)
        case 'get-all-tokens':
            return getAllTokensHandler(state)
        case 'get-all-tokens-started':
            return getAllTokensStartedHandler(state, action)
        case 'get-all-tokens-success':
            return getAllTokensSuccessHandler(state, action)
        case 'get-all-tokens-failed':
            return getAllTokensFailedHandler(state, action)
        case 'get-token':
            return getTokenHandler(state)
        case 'get-token-started':
            return getTokenStartedHandler(state, action)
        case 'get-token-success':
            return getTokenSuccessHandler(state, action)
        case 'get-token-failed':
            return getTokenFailedHandler(state, action)
        case 'create-token':
            return createTokenHandler(state)
        case 'create-token-started':
            return createTokenStartedHandler(state, action)
        case 'create-token-success':
            return createTokenSuccessHandler(state, action)
        case 'create-token-failed':
            return createTokenFailedHandler(state, action)
        case 'create-token-subscribe':
            return createTokenSubscribeHandler(state)
        case 'create-token-subscribe-started':
            return createTokenSubscribeStartedHandler(state, action)
        case 'create-token-subscribe-success':
            return createTokenSubscribeSuccessHandler(state, action)
        case 'create-token-subscribe-failed':
            return createTokenSubscribeFailedHandler(state, action)
        case 'create-token-unsubscribe':
            return createTokenUnsubscribeHandler(state)
        case 'create-token-unsubscribe-started':
            return createTokenUnsubscribeStartedHandler(state, action)
        case 'create-token-unsubscribe-success':
            return createTokenUnsubscribeSuccessHandler(state, action)
        case 'create-token-unsubscribe-failed':
            return createTokenUnsubscribeFailedHandler(state, action)
        default:
            return state
    }
}

export const tokensSideEffects =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<TokensState, TokensActions>> => {
        const boundHydrate = hydrateSideEffect()
        const boundGetAll = getAllTokensSideEffect(websocket)
        const boundGet = getTokenSideEffect(websocket)
        const boundCreate = createTokenSideEffect(websocket)
        const boundSubscribe = createTokenSubscribeSideEffect(websocket)
        const boundUnsubscribe = createTokenUnsubscribeSideEffect(websocket)

        return (state, action, dispatch) => {
            switch (action.type) {
                case 'hydrate':
                    return boundHydrate(state, action, dispatch)
                case 'get-all-tokens':
                    return boundGetAll(state, action, dispatch)
                case 'get-token':
                    return boundGet(state, action, dispatch)
                case 'create-token':
                    return boundCreate(state, action, dispatch)
                case 'create-token-subscribe':
                    return boundSubscribe(state, action, dispatch)
                case 'create-token-unsubscribe':
                    return boundUnsubscribe(state, action, dispatch)
            }
        }
    }
