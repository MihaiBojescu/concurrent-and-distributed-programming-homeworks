import React from 'react'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { createVisualisationFailedHandler, createVisualisationHandler, createVisualisationSideEffect, createVisualisationStartedHandler, createVisualisationSuccessHandler } from './service/create'
import { getVisualisationFailedHandler, getVisualisationHandler, getVisualisationSideEffect, getVisualisationStartedHandler, getVisualisationSuccessHandler } from './service/get'
import { getAllVisualisationsFailedHandler, getAllVisualisationsHandler, getAllVisualisationsSideEffect, getAllVisualisationsStartedHandler, getAllVisualisationsSuccessHandler } from './service/getAll'
import { hydrate, hydrateFailedHandler, hydrateSuccessHandler } from './service/hydrate'
import { createVisualisationSubscribeFailedHandler, createVisualisationSubscribeHandler, createVisualisationSubscribeSideEffect, createVisualisationSubscribeStartedHandler, createVisualisationSubscribeSuccessHandler } from './service/subscribe'
import { createVisualisationUnsubscribeFailedHandler, createVisualisationUnsubscribeHandler, createVisualisationUnsubscribeSideEffect, createVisualisationUnsubscribeStartedHandler, createVisualisationUnsubscribeSuccessHandler } from './service/unsubscribe'
import { Visualisation, VisualisationsActions, VisualisationsState } from './types'


export const visualisationsInitialState: VisualisationsState = ({
    loading: true,
    subscriptions: {},
    data: {},

    getAllVisualisations: {
        requests: {},
        fetching: false,
        error: null,
    },
    getVisualisation: {
        requests: {},
        fetching: false,
        error: null,
    },
    createVisualisation: {
        requests: {},
        fetching: false,
        error: null,
    },
    createVisualisationsSubscribe: {
        requests: {},
        fetching: false,
        error: null,
    },
    createVisualisationsUnsubscribe: {
        requests: {},
        fetching: false,
        error: null,
    },
})

export const visualisationsReducer: React.Reducer<VisualisationsState, VisualisationsActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-success':
            return hydrateSuccessHandler(action)
        case 'hydrate-failed':
            return hydrateFailedHandler(state)
        case 'get-all-visualisations':
            return getAllVisualisationsHandler(state)
        case 'get-all-visualisations-started':
            return getAllVisualisationsStartedHandler(state, action)
        case 'get-all-visualisations-success':
            return getAllVisualisationsSuccessHandler(state, action)
        case 'get-all-visualisations-failed':
            return getAllVisualisationsFailedHandler(state, action)
        case 'get-visualisation':
            return getVisualisationHandler(state)
        case 'get-visualisation-started':
            return getVisualisationStartedHandler(state, action)
        case 'get-visualisation-success':
            return getVisualisationSuccessHandler(state, action)
        case 'get-visualisation-failed':
            return getVisualisationFailedHandler(state, action)
        case 'create-visualisation':
            return createVisualisationHandler(state)
        case 'create-visualisation-started':
            return createVisualisationStartedHandler(state, action)
        case 'create-visualisation-success':
            return createVisualisationSuccessHandler(state, action)
        case 'create-visualisation-failed':
            return createVisualisationFailedHandler(state, action)
        case 'create-visualisation-subscribe':
            return createVisualisationSubscribeHandler(state)
        case 'create-visualisation-subscribe-started':
            return createVisualisationSubscribeStartedHandler(state, action)
        case 'create-visualisation-subscribe-success':
            return createVisualisationSubscribeSuccessHandler(state, action)
        case 'create-visualisation-subscribe-failed':
            return createVisualisationSubscribeFailedHandler(state, action)
        case 'create-visualisation-unsubscribe':
            return createVisualisationUnsubscribeHandler(state)
        case 'create-visualisation-unsubscribe-started':
            return createVisualisationUnsubscribeStartedHandler(state, action)
        case 'create-visualisation-unsubscribe-success':
            return createVisualisationUnsubscribeSuccessHandler(state, action)
        case 'create-visualisation-unsubscribe-failed':
            return createVisualisationUnsubscribeFailedHandler(state, action)
        default:
            return state
    }
}

export const visualisationsSideEffects =
    (websocket: ManagedWebSocket, additionalSubscriptions: (visualisation: Visualisation) => void): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>> => {
        const boundHydrate = hydrate()
        const boundGetAll = getAllVisualisationsSideEffect(websocket)
        const boundGet = getVisualisationSideEffect(websocket)
        const boundCreate = createVisualisationSideEffect(websocket, additionalSubscriptions)
        const boundSubscribe = createVisualisationSubscribeSideEffect(websocket, additionalSubscriptions)
        const boundUnsubscribe = createVisualisationUnsubscribeSideEffect(websocket)

        return (state, action, dispatch) => {
            switch (action.type) {
                case 'hydrate':
                    return boundHydrate(state, action, dispatch)
                case 'get-all-visualisations':
                    return boundGetAll(state, action, dispatch)
                case 'get-visualisation':
                    return boundGet(state, action, dispatch)
                case 'create-visualisation':
                    return boundCreate(state, action, dispatch)
                case 'create-visualisation-subscribe':
                    return boundSubscribe(state, action, dispatch)
                case 'create-visualisation-unsubscribe':
                    return boundUnsubscribe(state, action, dispatch)
            }
        }
    }

