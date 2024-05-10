import React, { createContext, useCallback, useContext } from "react";
import { Visualisation, VisualisationsActions, VisualisationsState } from "./types";
import { visualisationsInitialState, visualisationsReducer, visualisationsSideEffects } from "./reducer";
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";
import { DataContext } from "../data/context";

interface Props {
    websocket: ManagedWebSocket,
    children: React.ReactNode
}

export const VisualisationsContext = createContext<readonly [VisualisationsState, (action: VisualisationsActions) => void]>([visualisationsInitialState, () => undefined])

export const VisualisationsContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [dataState, dataDispatch] = useContext(DataContext)

    const additionalSubscriptions = useCallback((visualisation: Visualisation) => {
        dataDispatch({ type: 'create-data-subscribe', data: { visualisationId: visualisation.visualisation_id } })
    }, [dataDispatch])

    const [state, dispatch] = useReducerWithSideEffects(visualisationsReducer, visualisationsSideEffects(websocket, additionalSubscriptions), visualisationsInitialState)

    return (
        <VisualisationsContext.Provider value={[state, dispatch]}>
            {children}
        </VisualisationsContext.Provider>
    )
}