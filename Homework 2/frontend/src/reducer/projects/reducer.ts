import React from 'react'
import { ReducerSideEffect } from '../../hooks/useReducerWithSideEffects'
import { ManagedWebSocket } from '../../hooks/useWebSockets'
import { createProjectFailedHandler, createProjectHandler, createProjectSideEffect, createProjectStartedHandler, createProjectSuccessHandler } from './service/create'
import { getProjectFailedHandler, getProjectHandler, getProjectSideEffect, getProjectStartedHandler, getProjectSuccessHandler } from './service/get'
import { getAllProjectsFailedHandler, getAllProjectsHandler, getAllProjectsSideEffect, getAllProjectsStartedHandler, getAllProjectsSuccessHandler } from './service/getAll'
import { hydrate, hydrateFailedHandler, hydrateSuccessHandler } from './service/hydrate'
import { createProjectSubscribeFailedHandler, createProjectSubscribeHandler, createProjectSubscribeStartedHandler, createProjectSubscribeSuccessHandler, subscribe } from './service/subscribe'
import { createProjectUnsubscribeFailedHandler, createProjectUnsubscribeHandler, createProjectUnsubscribeStartedHandler, createProjectUnsubscribeSuccessHandler, unsubscribe } from './service/unsubscribe'
import { Project, ProjectsActions, ProjectsState } from './types'


export const projectsInitialState: ProjectsState = ({
    loading: true,
    subscriptions: null,
    data: [],

    getProjects: {
        requests: {},
        fetching: false,
        error: null,
    },
    getProject: {
        requests: {},
        fetching: false,
        error: null,
    },
    createProject: {
        requests: {},
        fetching: false,
        error: null,
    },
    createProjectsSubscribe: {
        requests: {},
        fetching: false,
        error: null,
    },
    createProjectsUnsubscribe: {
        requests: {},
        fetching: false,
        error: null
    }
})

export const projectsReducer: React.Reducer<ProjectsState, ProjectsActions> = (state, action) => {
    switch (action.type) {
        case 'hydrate-success':
            return hydrateSuccessHandler(action)
        case 'hydrate-failed':
            return hydrateFailedHandler(state)
        case 'get-all-projects':
            return getAllProjectsHandler(state)
        case 'get-all-projects-started':
            return getAllProjectsStartedHandler(state, action)
        case 'get-all-projects-success':
            return getAllProjectsSuccessHandler(state, action)
        case 'get-all-projects-failed':
            return getAllProjectsFailedHandler(state, action)
        case 'get-project':
            return getProjectHandler(state)
        case 'get-project-started':
            return getProjectStartedHandler(state, action)
        case 'get-project-success':
            return getProjectSuccessHandler(state, action)
        case 'get-project-failed':
            return getProjectFailedHandler(state, action)
        case 'create-project':
            return createProjectHandler(state)
        case 'create-project-started':
            return createProjectStartedHandler(state, action)
        case 'create-project-success':
            return createProjectSuccessHandler(state, action)
        case 'create-project-failed':
            return createProjectFailedHandler(state, action)
        case 'create-project-subscribe':
            return createProjectSubscribeHandler(state)
        case 'create-project-subscribe-started':
            return createProjectSubscribeStartedHandler(state, action)
        case 'create-project-subscribe-success':
            return createProjectSubscribeSuccessHandler(state, action)
        case 'create-project-subscribe-failed':
            return createProjectSubscribeFailedHandler(state, action)
        case 'create-project-unsubscribe':
            return createProjectUnsubscribeHandler(state)
        case 'create-project-unsubscribe-started':
            return createProjectUnsubscribeStartedHandler(state, action)
        case 'create-project-unsubscribe-success':
            return createProjectUnsubscribeSuccessHandler(state, action)
        case 'create-project-unsubscribe-failed':
            return createProjectUnsubscribeFailedHandler(state, action)
        default:
            return state
    }
}

export const projectsSideEffects = (
    websocket: ManagedWebSocket,
    additionalSubscriptions: (project: Project) => void
): ReducerSideEffect<React.Reducer<ProjectsState, ProjectsActions>> => {
    const boundGetAllProjects = getAllProjectsSideEffect(websocket)
    const boundGetProject = getProjectSideEffect(websocket)
    const boundCreateProject = createProjectSideEffect(websocket, additionalSubscriptions)
    const boundCreateProjectSubscribe = subscribe(websocket, additionalSubscriptions)
    const boundCreateProjectUnsubscribe = unsubscribe(websocket)

    return (state, action, dispatch) => {
        switch (action.type) {
            case 'hydrate':
                return hydrate(state, action, dispatch)
            case 'get-all-projects':
                return boundGetAllProjects(state, action, dispatch)
            case 'get-project':
                return boundGetProject(state, action, dispatch)
            case 'create-project':
                return boundCreateProject(state, action, dispatch)
            case 'create-project-subscribe':
                return boundCreateProjectSubscribe(state, action, dispatch)
            case 'create-project-unsubscribe':
                return boundCreateProjectUnsubscribe(state, action, dispatch)
        }
    }
}
