import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { ProjectsState, ProjectsGetSuccessAction, ProjectsGetFailedAction, Project, ProjectsActions, ProjectsError, ProjectsGetAction, ProjectsGetStartedAction } from "../types";

export const getProjectHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    getProject: {
        ...state.getProject,
        fetching: true,
        error: null
    }
});

export const getProjectStartedHandler = (state: ProjectsState, action: ProjectsGetStartedAction): ProjectsState => ({
    ...state,
    getProject: {
        ...state.getProject,
        requests: {
            ...state.getProject.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export function getProjectSuccessHandler(state: ProjectsState, action: ProjectsGetSuccessAction) {
    const original = state.data || [action.data]
    const existingProjectIndex = original.findIndex(item => item.project_id === action.data.data.project_id);
    const copy = original.slice()

    if (existingProjectIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingProjectIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.getProject.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: copy,
        getProject: {
            ...state.getProject,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            data: action.data
        }
    };
}

export const getProjectFailedHandler = (state: ProjectsState, action: ProjectsGetFailedAction): ProjectsState => {
    const requestsCopy = { ...state.getProject.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        getProject: {
            ...state.getProject,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
};

export const getProjectSideEffect = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsGetAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'get-project-started', data: { requestId } })

            const result = await websocket.request<{ project: Project } | ProjectsError>('projects-get', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'get-project-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'get-project-success', data: { requestId, data: result.project } })
        } catch (error) {
            dispatch({ type: 'get-project-failed', data: { requestId, reason: error as string } })
        }
    }
