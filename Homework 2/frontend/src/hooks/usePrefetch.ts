import { useCallback, useContext, useEffect, useState } from "react"
import { DataContext } from "../reducer/data/context"
import { ProjectsContext } from "../reducer/projects/context"
import { TokensContext } from "../reducer/tokens/context"
import { VisualisationsContext } from "../reducer/visualisations/context"

export const usePrefetch = (isAuthenticated: boolean) => {
    const [projectsState, projectsDispatch] = useContext(ProjectsContext)
    const [tokensState, tokensDispatch] = useContext(TokensContext)
    const [visualisationsState, visualisationsDispatch] = useContext(VisualisationsContext)
    const [dataState, dataDispatch] = useContext(DataContext)

    const [isProjectsRequested, setIsProjectsRequested] = useState(false)
    const [isTokensRequested, setIsTokensRequested] = useState(false)
    const [isVisualisationsRequested, setIsVisualisationsRequested] = useState(false)
    const [isDataRequested, setIsDataRequested] = useState(false)

    const [isReady, setIsReady] = useState(false)

    const prefetchData = useCallback(
        () => {
            if (!isAuthenticated) {
                return
            }

            if (
                projectsState.getProjects.fetching ||
                tokensState.getTokens.fetching ||
                visualisationsState.getAllVisualisations.fetching ||
                dataState.getData.fetching
            ) {
                return
            }

            if (!isProjectsRequested) {
                projectsDispatch({ type: 'get-all-projects' })
                projectsDispatch({ type: 'create-project-subscribe' })
                setIsProjectsRequested(true)
                return
            }

            if (!isTokensRequested) {
                for (const project of projectsState.data) {
                    tokensDispatch({ type: 'get-all-tokens', data: { projectId: project.project_id } })
                    tokensDispatch({ type: 'create-token-subscribe', data: { projectId: project.project_id } })
                }

                setIsTokensRequested(true)
                return
            }

            if (!isVisualisationsRequested) {
                for (const project of projectsState.data) {
                    visualisationsDispatch({ type: 'get-all-visualisations', data: { projectId: project.project_id } })
                    visualisationsDispatch({ type: 'create-visualisation-subscribe', data: { projectId: project.project_id } })
                }

                setIsVisualisationsRequested(true)
                return
            }

            if (!isDataRequested) {
                for (const projectId in visualisationsState.data) {
                    for (const visualisation of visualisationsState.data[projectId]) {
                        dataDispatch({ type: 'get-all-data', data: { visualisationId: visualisation.visualisation_id } })
                        dataDispatch({ type: 'create-data-subscribe', data: { visualisationId: visualisation.visualisation_id } })
                    }
                }

                setIsDataRequested(true)
                return
            }

            setIsReady(true)
        },
        [
            isAuthenticated,
            isProjectsRequested,
            isTokensRequested,
            isVisualisationsRequested,
            isDataRequested,
            projectsState,
            projectsDispatch,
            tokensState,
            tokensDispatch,
            visualisationsState,
            visualisationsDispatch,
            dataState,
            dataDispatch
        ]
    )

    useEffect(() => {
        prefetchData()
    }, [prefetchData])

    return isReady
}
