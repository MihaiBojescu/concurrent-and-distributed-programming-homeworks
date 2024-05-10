import React, { createContext } from "react";
import { DataActions, DataState } from "./types";
import { dataInitialState, dataReducer, dataSideEffects } from "./reducer";
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";

interface Props {
    websocket: ManagedWebSocket,
    children: React.ReactNode
}

export const DataContext = createContext<readonly [DataState, (action: DataActions) => void]>([dataInitialState, () => undefined])

export const DataContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [state, dispatch] = useReducerWithSideEffects(dataReducer, dataSideEffects(websocket), dataInitialState)

    return (
        <DataContext.Provider value={[state, dispatch]}>
            {children}
        </DataContext.Provider>
    )
}