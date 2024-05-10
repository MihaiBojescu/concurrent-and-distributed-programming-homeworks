import { Subscription } from "../../hooks/useWebSockets"

export type Visualisation = {
    visualisation_id: string
    project_id: string
    name: string
    description: string
    type: string
}

export type VisualisationsError = {
    reason: string
}

export type VisualisationsState = {
    loading: boolean
    subscriptions: Record<string, Subscription>
    data: Record<string, Visualisation[]>

    getAllVisualisations: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    getVisualisation: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createVisualisation: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createVisualisationsSubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createVisualisationsUnsubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
}

export type VisualisationsHydrateAction = { type: 'hydrate' }
export type VisualisationsHydrateSuccessfulAction = { type: 'hydrate-success', data: VisualisationsState }
export type VisualisationsHydrateFailedAction = { type: 'hydrate-failed' }
export type VisualisationsGetAllAction = { type: 'get-all-visualisations', data: { projectId: string } }
export type VisualisationsGetAllStartedAction = { type: 'get-all-visualisations-started', data: { requestId: string } }
export type VisualisationsGetAllSuccessAction = { type: 'get-all-visualisations-success', data: { requestId: string, projectId: string, data: Visualisation[] } }
export type VisualisationsGetAllFailedAction = { type: 'get-all-visualisations-failed', data: { requestId: string, reason: string } }
export type VisualisationsGetAction = { type: 'get-visualisation', data: { projectId: string, visualisationId: string } }
export type VisualisationsGetStartedAction = { type: 'get-visualisation-started', data: { requestId: string } }
export type VisualisationsGetSuccessAction = { type: 'get-visualisation-success', data: { requestId: string, projectId: string, data: Visualisation } }
export type VisualisationsGetFailedAction = { type: 'get-visualisation-failed', data: { requestId: string, reason: string } }
export type VisualisationsCreateAction = { type: 'create-visualisation', data: { projectId: string, name: string, description: string, type: string } }
export type VisualisationsCreateStartedAction = { type: 'create-visualisation-started', data: { requestId: string } }
export type VisualisationsCreateSuccessAction = { type: 'create-visualisation-success', data: { requestId: string, projectId: string, data: Visualisation } }
export type VisualisationsCreateFailedAction = { type: 'create-visualisation-failed', data: { requestId: string, reason: string } }
export type VisualisationsCreateSubscribeAction = { type: 'create-visualisation-subscribe', data: { projectId: string } }
export type VisualisationsCreateSubscribeStartedAction = { type: 'create-visualisation-subscribe-started', data: { requestId: string } }
export type VisualisationsCreateSubscribeSuccessAction = { type: 'create-visualisation-subscribe-success', data: { requestId: string, projectId: string, subscription: Subscription } }
export type VisualisationsCreateSubscribeFailedAction = { type: 'create-visualisation-subscribe-failed', data: { requestId: string, reason: string } }
export type VisualisationsCreateUnsubscribeAction = { type: 'create-visualisation-unsubscribe', data: { projectId: string } }
export type VisualisationsCreateUnsubscribeStartedAction = { type: 'create-visualisation-unsubscribe-started', data: { requestId: string } }
export type VisualisationsCreateUnsubscribeSuccessAction = { type: 'create-visualisation-unsubscribe-success', data: { requestId: string, projectId: string } }
export type VisualisationsCreateUnsubscribeFailedAction = { type: 'create-visualisation-unsubscribe-failed', data: { requestId: string, reason: string } }
export type VisualisationsActions =
    | VisualisationsHydrateAction
    | VisualisationsHydrateSuccessfulAction
    | VisualisationsHydrateFailedAction
    | VisualisationsGetAllAction
    | VisualisationsGetAllStartedAction
    | VisualisationsGetAllSuccessAction
    | VisualisationsGetAllFailedAction
    | VisualisationsGetAction
    | VisualisationsGetStartedAction
    | VisualisationsGetSuccessAction
    | VisualisationsGetFailedAction
    | VisualisationsCreateAction
    | VisualisationsCreateStartedAction
    | VisualisationsCreateSuccessAction
    | VisualisationsCreateFailedAction
    | VisualisationsCreateSubscribeAction
    | VisualisationsCreateSubscribeStartedAction
    | VisualisationsCreateSubscribeSuccessAction
    | VisualisationsCreateSubscribeFailedAction
    | VisualisationsCreateUnsubscribeAction
    | VisualisationsCreateUnsubscribeStartedAction
    | VisualisationsCreateUnsubscribeSuccessAction
    | VisualisationsCreateUnsubscribeFailedAction
