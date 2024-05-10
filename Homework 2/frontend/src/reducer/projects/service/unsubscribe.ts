import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { ProjectsActions, ProjectsCreateUnsubscribeAction, ProjectsCreateUnsubscribeFailedAction, ProjectsCreateUnsubscribeStartedAction, ProjectsCreateUnsubscribeSuccessAction, ProjectsState } from "../types";

export const createProjectUnsubscribeHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    createProjectsUnsubscribe: {
        ...state.createProjectsUnsubscribe,
        fetching: true,
        error: null
    }
});

export const createProjectUnsubscribeStartedHandler = (state: ProjectsState, action: ProjectsCreateUnsubscribeStartedAction): ProjectsState => ({
    ...state,
    createProjectsUnsubscribe: {
        ...state.createProjectsUnsubscribe,
        requests: {
            ...state.createProjectsUnsubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: false,
        error: null,
    }
});

export const createProjectUnsubscribeSuccessHandler = (state: ProjectsState, action: ProjectsCreateUnsubscribeSuccessAction): ProjectsState => {
    const requestsCopy = { ...state.createProjectsUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createProjectsUnsubscribe: {
            ...state.createProjectsUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    }
};

export const createProjectUnsubscribeFailedHandler = (state: ProjectsState, action: ProjectsCreateUnsubscribeFailedAction): ProjectsState => {
    const requestsCopy = { ...state.createProjectsUnsubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return {
        ...state,
        createProjectsUnsubscribe: {
            ...state.createProjectsUnsubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    }
};

export const unsubscribe = (websocket: ManagedWebSocket): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsCreateUnsubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-project-unsubscribe-started', data: { requestId } })
            await state.subscriptions?.unsubscribe()
            dispatch({ type: 'create-project-unsubscribe-success', data: { requestId } })
        } catch (error) {
            dispatch({ type: 'create-project-unsubscribe-failed', data: { requestId, reason: error as string } })
        }
    }
