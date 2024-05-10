import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import {
    VisualisationsActions,
    VisualisationsHydrateAction,
    VisualisationsHydrateSuccessfulAction,
    VisualisationsState
} from "../types";

export const hydrateSuccessHandler = (action: VisualisationsHydrateSuccessfulAction): VisualisationsState => ({
    ...action.data,
    loading: false,
    data: action.data.data,
    subscriptions: {},
    getAllVisualisations: {
        ...action.data.getAllVisualisations,
        requests: {},
        fetching: false,
        error: null
    },
    getVisualisation: {
        ...action.data.getVisualisation,
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisation: {
        ...action.data.createVisualisation,
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisationsSubscribe: {
        ...action.data.createVisualisationsSubscribe,
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisationsUnsubscribe: {
        ...action.data.createVisualisationsUnsubscribe,
        requests: {},
        fetching: false,
        error: null
    }
});

export const hydrateFailedHandler = (state: VisualisationsState): VisualisationsState => ({
    ...state,
    loading: false,
    data: {},
    subscriptions: {},
    getAllVisualisations: {
        requests: {},
        fetching: false,
        error: null
    },
    getVisualisation: {
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisation: {
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisationsSubscribe: {
        requests: {},
        fetching: false,
        error: null
    },
    createVisualisationsUnsubscribe: {
        requests: {},
        fetching: false,
        error: null
    }
});

export const hydrate = (): ReducerSideEffect<React.Reducer<VisualisationsState, VisualisationsActions>, VisualisationsHydrateAction> => (state, action, dispatch) => {
    try {
        const data = localStorage.getItem('visualisations-reducer')

        if (!data) {
            return dispatch({ type: 'hydrate-failed' })
        }

        dispatch({ type: 'hydrate-success', data: JSON.parse(data) })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}

