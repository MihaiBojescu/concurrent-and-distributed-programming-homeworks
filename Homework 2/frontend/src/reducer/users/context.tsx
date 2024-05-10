import React, { createContext } from "react";
import { UsersActions, UsersState } from "./types";
import { usersInitialState, usersSideEffects } from "./reducer";
import { usersReducer } from './reducer';
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";

interface Props {
    websocket: ManagedWebSocket,
    children: React.ReactNode
}

export const UsersContext = createContext<readonly [UsersState, (action: UsersActions) => void]>([usersInitialState, () => undefined])

export const UsersContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [state, dispatch] = useReducerWithSideEffects(usersReducer, usersSideEffects(websocket), usersInitialState)

    return (
        <UsersContext.Provider value={[state, dispatch]}>
            {children}
        </UsersContext.Provider>
    )
}