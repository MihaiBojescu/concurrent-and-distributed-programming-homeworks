import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Project, ProjectsActions, ProjectsError, ProjectsGetAllAction, ProjectsGetAllFailedAction, ProjectsGetAllStartedAction, ProjectsGetAllSuccessAction, ProjectsState } from "../types";

export const getAllProjectsHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    getProjects: {
        ...state.getProjects,
        fetching: true,
        error: null
    }
});
export const getAllProjectsStartedHandler = (state: ProjectsState, action: ProjectsGetAllStartedAction): ProjectsState => ({
    ...state,
    getProjects: {
        ...state.getProjects,
        requests: {
            ...state.getProjects.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const getAllProjectsSuccessHandler = (state: ProjectsState, action: ProjectsGetAllSuccessAction): ProjectsState => {
    const requestsCopy = { ...state.getProjects.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: action.data.data,
        getProjects: {
            ...state.getProjects,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
}

export const getAllProjectsFailedHandler = (state: ProjectsState, action: ProjectsGetAllFailedAction): ProjectsState => {
    const requestsCopy = { ...state.getProjects.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getProjects: {
            ...state.getProjects,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason,
        }
    }
};

export const getAllProjectsSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsGetAllAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-all-projects-started', data: { requestId } })

            const result = await websocket.request<{ projects: Project[] } | ProjectsError>('projects-get-all', undefined)

            if ('reason' in result) {
                return dispatch({ type: 'get-all-projects-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-all-projects-success', data: { requestId, data: result.projects } })
        } catch (error) {
            dispatch({ type: 'get-all-projects-failed', data: { requestId, reason: error as string } })
        }
    }

