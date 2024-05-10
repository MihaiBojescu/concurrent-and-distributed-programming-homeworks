import React from 'react'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { createDataFailedHandler, createDataHandler, createDataSideEffect, createDataStartedHandler, createDataSuccessHandler } from './service/create'
import { getDataFailedHandler, getDataHandler, getDataSideEffect, getDataStartedHandler, getDataSuccessHandler } from './service/get'
import { hydrateFailedHandler, hydrateSideEffect, hydrateSuccessHandler } from './service/hydrate'
import { createDataSubscribeFailedHandler, createDataSubscribeHandler, createDataSubscribeSideEffect, createDataSubscribeStartedHandler, createDataSubscribeSuccessHandler } from './service/subscribe'
import { createDataUnsubscribeFailedHandler, createDataUnsubscribeHandler, createDataUnsubscribeSideEffect, createDataUnsubscribeStartedHandler, createDataUnsubscribeSuccessHandler } from './service/unsubscribe'
import { DataActions, DataState } from './types'


export const dataInitialState: DataState = ({
    loading: true,
    subscriptions: {},
    data: {},
    getData: {
        requests: {},
        fetching: false,
        error: null,
    },
    createData: {
        requests: {},
        fetching: false,
        error: null,
    },
    createDataSubscribe: {
        requests: {},
        fetching: false,
        error: null,
    },
    createDataUnsubscribe: {
        requests: {},
        fetching: false,
        error: null
    }
})

export const dataReducer: React.Reducer<DataState, DataActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-success':
            return hydrateSuccessHandler(state, action)
        case 'hydrate-failed':
            return hydrateFailedHandler(state, action)
        case 'get-all-data':
            return getDataHandler(state, action)
        case 'get-all-data-started':
            return getDataStartedHandler(state, action)
        case 'get-all-data-success':
            return getDataSuccessHandler(state, action)
        case 'get-all-data-failed':
            return getDataFailedHandler(state, action)
        case 'create-data':
            return createDataHandler(state, action)
        case 'create-data-started':
            return createDataStartedHandler(state, action)
        case 'create-data-success':
            return createDataSuccessHandler(state, action)
        case 'create-data-failed':
            return createDataFailedHandler(state, action)
        case 'create-data-subscribe':
            return createDataSubscribeHandler(state, action)
        case 'create-data-subscribe-started':
            return createDataSubscribeStartedHandler(state, action)
        case 'create-data-subscribe-success':
            return createDataSubscribeSuccessHandler(state, action)
        case 'create-data-subscribe-failed':
            return createDataSubscribeFailedHandler(state, action)
        case 'create-data-unsubscribe':
            return createDataUnsubscribeHandler(state, action)
        case 'create-data-unsubscribe-started':
            return createDataUnsubscribeStartedHandler(state, action)
        case 'create-data-unsubscribe-success':
            return createDataUnsubscribeSuccessHandler(state, action)
        case 'create-data-unsubscribe-failed':
            return createDataUnsubscribeFailedHandler(state, action)
        default:
            return state
    }
}

export const dataSideEffects =
    (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<DataState, DataActions>> => {
        const boundHydrate = hydrateSideEffect()
        const boundGetData = getDataSideEffect(websocket)
        const boundCreateData = createDataSideEffect(websocket)
        const boundCreateDataSubscribe = createDataSubscribeSideEffect(websocket)
        const boundCreateDataUnsubscribe = createDataUnsubscribeSideEffect(websocket)

        return (state, action, dispatch) => {
            switch (action.type) {
                case 'hydrate':
                    return boundHydrate(state, action, dispatch)
                case 'get-all-data':
                    return boundGetData(state, action, dispatch)
                case 'create-data':
                    return boundCreateData(state, action, dispatch)
                case 'create-data-subscribe':
                    return boundCreateDataSubscribe(state, action, dispatch)
                case 'create-data-unsubscribe':
                    return boundCreateDataUnsubscribe(state, action, dispatch)
            }
        }
    }

