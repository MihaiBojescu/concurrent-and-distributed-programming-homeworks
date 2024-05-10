import React, { createContext, useCallback, useContext } from "react";
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";
import { TokensContext } from "../tokens/context";
import { VisualisationsContext } from "../visualisations/context";
import { projectsInitialState, projectsReducer, projectsSideEffects } from "./reducer";
import { Project, ProjectsActions, ProjectsState } from "./types";

interface Props {
    websocket: ManagedWebSocket
    children: React.ReactNode
}

export const ProjectsContext = createContext<readonly [ProjectsState, (action: ProjectsActions) => void]>([projectsInitialState, () => undefined])

export const ProjectsContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [tokensState, tokensDispatch] = useContext(TokensContext)
    const [visualisationsState, visualisationsDispatch] = useContext(VisualisationsContext)

    const additionalSubscriptions = useCallback((project: Project) => {
        tokensDispatch({ type: 'create-token-subscribe', data: { projectId: project.project_id } })
        visualisationsDispatch({ type: 'create-visualisation-subscribe', data: { projectId: project.project_id } })
    }, [tokensDispatch, visualisationsDispatch])

    const [state, dispatch] = useReducerWithSideEffects(projectsReducer, projectsSideEffects(websocket, additionalSubscriptions), projectsInitialState)

    return (
        <ProjectsContext.Provider value={[state, dispatch]}>
            {children}
        </ProjectsContext.Provider>
    )
}