import React from "react";
import { ReducerSideEffect } from "../../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../../hooks/useWebSockets";
import { Project, ProjectsActions, ProjectsCreateSubscribeAction, ProjectsCreateSubscribeFailedAction, ProjectsCreateSubscribeStartedAction, ProjectsCreateSubscribeSuccessAction, ProjectsError, ProjectsState } from "../types";

export const createProjectSubscribeHandler = (state: ProjectsState): ProjectsState => ({
    ...state,
    createProjectsSubscribe: {
        ...state.createProjectsSubscribe,
        fetching: true,
        error: null
    }
});

export const createProjectSubscribeStartedHandler = (state: ProjectsState, action: ProjectsCreateSubscribeStartedAction): ProjectsState => ({
    ...state,
    createProjectsSubscribe: {
        ...state.createProjectsSubscribe,
        requests: {
            ...state.createProjectsSubscribe.requests,
            [action.data.requestId]: true
        },
        fetching: false,
        error: null,
    }
});

export const createProjectSubscribeSuccessHandler = (state: ProjectsState, action: ProjectsCreateSubscribeSuccessAction): ProjectsState => {
    const requestsCopy = { ...state.createProjectsSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        subscriptions: action.data.data,
        createProjectsSubscribe: {
            ...state.createProjectsSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: null,
        }
    });
};

export const createProjectSubscribeFailedHandler = (state: ProjectsState, action: ProjectsCreateSubscribeFailedAction): ProjectsState => {
    const requestsCopy = { ...state.createProjectsSubscribe.requests }
    delete requestsCopy[action.data.requestId]

    return ({
        ...state,
        createProjectsSubscribe: {
            ...state.createProjectsSubscribe,
            requests: requestsCopy,
            fetching: Object.keys(requestsCopy).length !== 0,
            error: action.data.reason
        }
    });
};

export const subscribe = (
    websocket: ManagedWebSocket,
    additionalSubscriptions: (project: Project) => void
): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>, ProjectsCreateSubscribeAction> =>
    async (state, action, dispatch) => {
        const requestId = window.crypto.randomUUID()

        try {
            dispatch({ type: 'create-project-subscribe-started', data: { requestId } })

            const result = await websocket.subscribe<{ project: Project } | ProjectsError>('projects-create', null, (message) => {
                if ('reason' in message) {
                    return
                }

                dispatch({ type: 'create-project-success', data: { requestId: '', data: message.project } })
                additionalSubscriptions(message.project)
            })

            dispatch({ type: 'create-project-subscribe-success', data: { requestId, data: result } })
        } catch (error) {
            dispatch({ type: 'create-project-subscribe-failed', data: { requestId, reason: error as string } })
        }
    }
