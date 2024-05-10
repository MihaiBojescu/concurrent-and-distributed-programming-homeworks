import { Subscription } from "../../hooks/useWebSockets"

export type Token = {
    token_id: string
    project_id: string
    name: string
    description: string
    token: string
}

export type TokensError = {
    reason: string
}

export type TokensState = {
    loading: boolean
    subscriptions: Record<string, Subscription>
    data: Record<string, Token[]>

    getTokens: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    getToken: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createToken: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createTokensSubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
    createTokensUnsubscribe: {
        requests: Record<string, true>
        fetching: boolean
        error: null | string
    }
}

export type TokensHydrateAction = { type: 'hydrate' }
export type TokensHydrateSuccessfulAction = { type: 'hydrate-success', data: TokensState }
export type TokensHydrateFailedAction = { type: 'hydrate-failed' }
export type TokensGetAllAction = { type: 'get-all-tokens', data: { projectId: string } }
export type TokensGetAllStartedAction = { type: 'get-all-tokens-started', data: { requestId: string } }
export type TokensGetAllSuccessAction = { type: 'get-all-tokens-success', data: { requestId: string, projectId: string, data: Token[] } }
export type TokensGetAllFailedAction = { type: 'get-all-tokens-failed', data: { requestId: string, reason: string } }
export type TokensGetAction = { type: 'get-token', data: { projectId: string, tokenId: string } }
export type TokensGetStartedAction = { type: 'get-token-started', data: { requestId: string } }
export type TokensGetSuccessAction = { type: 'get-token-success', data: { requestId: string, projectId: string, data: Token } }
export type TokensGetFailedAction = { type: 'get-token-failed', data: { requestId: string, reason: string } }
export type TokensCreateAction = { type: 'create-token', data: { projectId: string, name: string, description: string } }
export type TokensCreateStartedAction = { type: 'create-token-started', data: { requestId: string } }
export type TokensCreateSuccessAction = { type: 'create-token-success', data: { requestId: string, projectId: string, data: Token } }
export type TokensCreateFailedAction = { type: 'create-token-failed', data: { requestId: string, reason: string } }
export type TokensCreateSubscribeAction = { type: 'create-token-subscribe', data: { projectId: string } }
export type TokensCreateSubscribeStartedAction = { type: 'create-token-subscribe-started', data: { requestId: string } }
export type TokensCreateSubscribeSuccessAction = { type: 'create-token-subscribe-success', data: { requestId: string, projectId: string, subscription: Subscription } }
export type TokensCreateSubscribeFailedAction = { type: 'create-token-subscribe-failed', data: { requestId: string, reason: string } }
export type TokensCreateUnsubscribeAction = { type: 'create-token-unsubscribe', data: { projectId: string } }
export type TokensCreateUnsubscribeStartedAction = { type: 'create-token-unsubscribe-started', data: { requestId: string } }
export type TokensCreateUnsubscribeSuccessAction = { type: 'create-token-unsubscribe-success', data: { requestId: string, projectId: string } }
export type TokensCreateUnsubscribeFailedAction = { type: 'create-token-unsubscribe-failed', data: { requestId: string, reason: string } }
export type TokensActions =
    | TokensHydrateAction
    | TokensHydrateSuccessfulAction
    | TokensHydrateFailedAction
    | TokensGetAllAction
    | TokensGetAllStartedAction
    | TokensGetAllSuccessAction
    | TokensGetAllFailedAction
    | TokensGetAction
    | TokensGetStartedAction
    | TokensGetSuccessAction
    | TokensGetFailedAction
    | TokensCreateAction
    | TokensCreateStartedAction
    | TokensCreateSuccessAction
    | TokensCreateFailedAction
    | TokensCreateSubscribeAction
    | TokensCreateSubscribeStartedAction
    | TokensCreateSubscribeSuccessAction
    | TokensCreateSubscribeFailedAction
    | TokensCreateUnsubscribeAction
    | TokensCreateUnsubscribeStartedAction
    | TokensCreateUnsubscribeSuccessAction
    | TokensCreateUnsubscribeFailedAction
