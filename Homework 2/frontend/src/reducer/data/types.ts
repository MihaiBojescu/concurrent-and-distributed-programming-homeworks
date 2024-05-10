import { Subscription } from "../../hooks/useWebSockets"

export type Data = {
    data_id: string
    visualisation_id: string
    value: number
    timestamp: string
}

export type DataError = {
    reason: string
}

export type DataState = {
    loading: boolean
    subscriptions: Record<string, Subscription>
    data: Record<string, Data[]>

    getData: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createData: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createDataSubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createDataUnsubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
}

export type DataHydrateAction = { type: 'hydrate' }
export type DataHydrateSuccessfulAction = { type: 'hydrate-success', data: DataState }
export type DataHydrateFailedAction = { type: 'hydrate-failed' }
export type DataGetAction = { type: 'get-all-data', data: { visualisationId: string } }
export type DataGetStartedAction = { type: 'get-all-data-started', data: { requestId: string } }
export type DataGetSuccessAction = { type: 'get-all-data-success', data: { requestId: string, visualisationId: string, data: Data[] } }
export type DataGetFailedAction = { type: 'get-all-data-failed', data: { requestId: string, reason: string } }
export type DataCreateAction = { type: 'create-data', data: { visualisationId: string, value: number } }
export type DataCreateStartedAction = { type: 'create-data-started', data: { requestId: string } }
export type DataCreateSuccessAction = { type: 'create-data-success', data: { requestId: string, visualisationId: string, data: Data } }
export type DataCreateFailedAction = { type: 'create-data-failed', data: { requestId: string, reason: string } }
export type DataCreateSubscribeAction = { type: 'create-data-subscribe', data: { visualisationId: string } }
export type DataCreateSubscribeStartedAction = { type: 'create-data-subscribe-started', data: { requestId: string } }
export type DataCreateSubscribeSuccessAction = { type: 'create-data-subscribe-success', data: { requestId: string, visualisationId: string, subscription: Subscription } }
export type DataCreateSubscribeFailedAction = { type: 'create-data-subscribe-failed', data: { requestId: string, reason: string } }
export type DataCreateUnsubscribeAction = { type: 'create-data-unsubscribe', data: { visualisationId: string } }
export type DataCreateUnsubscribeStartedAction = { type: 'create-data-unsubscribe-started', data: { requestId: string } }
export type DataCreateUnsubscribeSuccessAction = { type: 'create-data-unsubscribe-success', data: { requestId: string, visualisationId: string } }
export type DataCreateUnsubscribeFailedAction = { type: 'create-data-unsubscribe-failed', data: { requestId: string, reason: string } }
export type DataActions =
    | DataHydrateAction
    | DataHydrateSuccessfulAction
    | DataHydrateFailedAction
    | DataGetAction
    | DataGetStartedAction
    | DataGetSuccessAction
    | DataGetFailedAction
    | DataCreateAction
    | DataCreateStartedAction
    | DataCreateSuccessAction
    | DataCreateFailedAction
    | DataCreateSubscribeAction
    | DataCreateSubscribeStartedAction
    | DataCreateSubscribeSuccessAction
    | DataCreateSubscribeFailedAction
    | DataCreateUnsubscribeAction
    | DataCreateUnsubscribeStartedAction
    | DataCreateUnsubscribeSuccessAction
    | DataCreateUnsubscribeFailedAction