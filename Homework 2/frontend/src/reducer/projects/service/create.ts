import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { ProjectsState, ProjectsCreateSuccessAction, ProjectsCreateFailedAction, Project, ProjectsActions, ProjectsCreateAction, ProjectsError, ProjectsCreateStartedAction } from "../types";

export const createProjectHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    createProject: {
        ...state.createProject,
        fetching: true,
        error: null
    }
});

export const createProjectStartedHandler = (state: ProjectsState, action: ProjectsCreateStartedAction): ProjectsState => ({
    ...state,
    createProject: {
        ...state.createProject,
        requests: {
            ...state.createProject.requests,
            [action.data.requestId]: true
        },
        fetching: true,
        error: null
    }
});

export const createProjectSuccessHandler = (state: ProjectsState, action: ProjectsCreateSuccessAction) => {
    const original = state.data || [action.data]
    const existingProjectIndex = original.findIndex(item => item.project_id === action.data.data.project_id);
    const copy = original.slice()

    if (existingProjectIndex === -1) {
        copy.push(action.data.data)
    } else {
        copy.splice(existingProjectIndex, 1, action.data.data)
    }

    const requestsCopy = { ...state.createProject.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        data: copy,
        createProject: {
            ...state.createProject,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    };
};

export const createProjectFailedHandler = (state: ProjectsState, action: ProjectsCreateFailedAction): ProjectsState => {
    const requestsCopy = { ...state.createProject.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createProject: {
            ...state.createProject,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
}

export const createProjectSideEffect = (
    websocket: ManagedWebSocket,
    additionalSubscriptions: (project: Project) => void
): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsCreateAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-project-started', data: { requestId } })

            const result = await websocket.request<{ project: Project } | ProjectsError>('projects-create', action.data)

            if ('reason' in result) {
                return dispatch({ type: 'create-project-failed', data: { requestId, reason: result.reason } })
            }

            dispatch({ type: 'create-project-success', data: { requestId, data: result.project } })
        } catch (error) {
            dispatch({ type: 'create-project-failed', data: { requestId, reason: error as string } })
        }
    }
