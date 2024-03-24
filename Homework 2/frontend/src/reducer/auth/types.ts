
export type User = {
    id: string
    username: string
}

export type AuthError = {
    cause: string
}

export type AuthState = {
    fetching: boolean,
    authenticated: boolean,
    error: null | string,
    user: null | User
}

export type AuthLoginAction = { type: 'login', credentials: { username: string, password: string } }
export type AuthLoginSuccessAction = { type: 'login-success', user: User }
export type AuthLoginFailedAction = { type: 'login-failed', error: string }
export type AuthActions = AuthLoginAction | AuthLoginSuccessAction | AuthLoginFailedAction