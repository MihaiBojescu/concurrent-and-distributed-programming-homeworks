import { useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VisualisationsContext } from "../../reducer/visualisations/context";
import { DataContext } from "../../reducer/data/context";


export const useVisualisationsPageLogic = () => {
    const [visualisationsState, ] = useContext(VisualisationsContext);
    const [dataState, ] = useContext(DataContext);
    const navigate = useNavigate();
    const params = useParams()

    const onGoToCreateVisualisation = useCallback(() => {
        navigate(`/app/projects/${params.projectId}/visualisations/create`);
    }, [params, navigate])

    const onGoToProjectsList = useCallback(() => {
        navigate('/app/projects')
    }, [navigate])

    return {
        visualisations: visualisationsState.data[params.projectId!] || [],
        data: dataState.data || [],

        onGoToCreateVisualisation,
        onGoToProjectsList
    }
}