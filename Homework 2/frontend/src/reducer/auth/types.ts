
export type User = {
    id: string
    username: string
}

export type Tokens = {
    token: string
}

export type AuthError = {
    cause: string
}

export type AuthState = {
    loading: boolean
    fetching: boolean
    isAuthenticated: boolean
    error: null | string
    tokens: null | Tokens
    user: null | User
}

export type AuthHydrateAction = { type: 'hydrate' }
export type AuthHydrateSuccessfulAction = { type: 'hydrate-successful', state: AuthState }
export type AuthHydrateFailedAction = { type: 'hydrate-failed' }
export type AuthLoginAction = { type: 'login', credentials: { username: string, password: string } }
export type AuthLoginSuccessAction = { type: 'login-success', user: User, tokens: Tokens }
export type AuthLoginFailedAction = { type: 'login-failed', error: string }
export type AuthActions = AuthHydrateAction | AuthHydrateSuccessfulAction | AuthHydrateFailedAction | AuthLoginAction | AuthLoginSuccessAction | AuthLoginFailedAction