import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ProjectsState, ProjectsHydrateSuccessfulAction, ProjectsActions, ProjectsHydrateAction } from "../types";

export const hydrateSuccessHandler = (action: ProjectsHydrateSuccessfulAction): ProjectsState => ({
    ...action.data,
    loading: false,
    getProjects: {
        ...action.data.getProjects,
        error: null,
        fetching: false
    },
    getProject: {
        ...action.data.getProject,
        error: null,
        fetching: false
    }
});

export const hydrateFailedHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    loading: false,
    getProjects: {
        ...state.getProjects,
        error: null,
        fetching: false
    },
    getProject: {
        ...state.getProject,
        error: null,
        fetching: false
    }
});

export const hydrate: ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsHydrateAction> = (state, action, dispatch) => {
    try {
        const data = localStorage.getItem('projects-reducer')

        if (!data) {
            return dispatch({ type: 'hydrate-failed' })
        }

        dispatch({ type: 'hydrate-success', data: JSON.parse(data) })
    } catch {
        dispatch({ type: 'hydrate-failed' })
    }
}
