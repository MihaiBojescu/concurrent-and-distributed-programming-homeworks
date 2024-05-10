import { Subscription } from "../../hooks/useWebSockets"

export type Project = {
    project_id: string
    user_id: string
    name: string
    description: string
}

export type ProjectsError = {
    reason: string
}

export type ProjectsState = {
    loading: boolean
    subscriptions: Subscription | null,
    data: Project[],

    getProjects: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    getProject: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createProject: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createProjectsSubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createProjectsUnsubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
}

export type ProjectsHydrateAction = { type: 'hydrate' }
export type ProjectsHydrateSuccessfulAction = { type: 'hydrate-success', data: ProjectsState }
export type ProjectsHydrateFailedAction = { type: 'hydrate-failed' }
export type ProjectsGetAllAction = { type: 'get-all-projects' }
export type ProjectsGetAllStartedAction = { type: 'get-all-projects-started', data: { requestId: string } }
export type ProjectsGetAllSuccessAction = { type: 'get-all-projects-success', data: { requestId: string, data: Project[] } }
export type ProjectsGetAllFailedAction = { type: 'get-all-projects-failed', data: { requestId: string, reason: string } }
export type ProjectsGetAction = { type: 'get-project', data: { projectId: string } }
export type ProjectsGetStartedAction = { type: 'get-project-started', data: { requestId: string } }
export type ProjectsGetSuccessAction = { type: 'get-project-success', data: { requestId: string, data: Project } }
export type ProjectsGetFailedAction = { type: 'get-project-failed', data: { requestId: string, reason: string } }
export type ProjectsCreateAction = { type: 'create-project', data: { name: string, description: string } }
export type ProjectsCreateStartedAction = { type: 'create-project-started', data: { requestId: string } }
export type ProjectsCreateSuccessAction = { type: 'create-project-success', data: { requestId: string, data: Project } }
export type ProjectsCreateFailedAction = { type: 'create-project-failed', data: { requestId: string, reason: string } }
export type ProjectsCreateSubscribeAction = { type: 'create-project-subscribe' }
export type ProjectsCreateSubscribeStartedAction = { type: 'create-project-subscribe-started', data: { requestId: string } }
export type ProjectsCreateSubscribeSuccessAction = { type: 'create-project-subscribe-success', data: { requestId: string, data: Subscription } }
export type ProjectsCreateSubscribeFailedAction = { type: 'create-project-subscribe-failed', data: { requestId: string, reason: string } }
export type ProjectsCreateUnsubscribeAction = { type: 'create-project-unsubscribe' }
export type ProjectsCreateUnsubscribeStartedAction = { type: 'create-project-unsubscribe-started', data: { requestId: string } }
export type ProjectsCreateUnsubscribeSuccessAction = { type: 'create-project-unsubscribe-success', data: { requestId: string } }
export type ProjectsCreateUnsubscribeFailedAction = { type: 'create-project-unsubscribe-failed', data: { requestId: string, reason: string } }
export type ProjectsActions =
    | ProjectsHydrateAction
    | ProjectsHydrateSuccessfulAction
    | ProjectsHydrateFailedAction
    | ProjectsGetAllAction
    | ProjectsGetAllStartedAction
    | ProjectsGetAllSuccessAction
    | ProjectsGetAllFailedAction
    | ProjectsGetAction
    | ProjectsGetStartedAction
    | ProjectsGetSuccessAction
    | ProjectsGetFailedAction
    | ProjectsCreateAction
    | ProjectsCreateStartedAction
    | ProjectsCreateSuccessAction
    | ProjectsCreateFailedAction
    | ProjectsCreateSubscribeAction
    | ProjectsCreateSubscribeStartedAction
    | ProjectsCreateSubscribeSuccessAction
    | ProjectsCreateSubscribeFailedAction
    | ProjectsCreateUnsubscribeAction
    | ProjectsCreateUnsubscribeStartedAction
    | ProjectsCreateUnsubscribeSuccessAction
    | ProjectsCreateUnsubscribeFailedAction
