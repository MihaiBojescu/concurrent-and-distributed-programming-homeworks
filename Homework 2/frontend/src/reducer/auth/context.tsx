import React, { ReducerAction, createContext } from "react";
import { AuthActions, AuthState } from "./types";
import { authInitialState, authReducer, authSideEffects } from "./reducer";
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";

interface Props {
    websocket: ManagedWebSocket,
    children: React.ReactNode
}

export const AuthContext = createContext<readonly [AuthState, (action: AuthActions) => void]>([authInitialState, () => undefined])

export const AuthContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [state, dispatch] = useReducerWithSideEffects(authReducer, authSideEffects(websocket), authInitialState)

    return (
        <AuthContext.Provider value={[state, dispatch]}>
            {children}
        </AuthContext.Provider>
    )
}