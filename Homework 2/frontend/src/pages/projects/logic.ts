import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectsContext } from "../../reducer/projects/context";


export const useProjectsPageLogic = () => {
    const [projectsState ] = useContext(ProjectsContext);
    const navigate = useNavigate();

    const onGoToCreateProject = () =>  {
        navigate('/app/projects/create')
    }

    const onGoToProject = (projectId: string) => () => {
        navigate(`/app/projects/${projectId}/visualisations`);
    };

    const onGoToProjectTokens = (projectId: string) => () => {
        navigate(`/app/projects/${projectId}/tokens`);
    };

    return {
        projects: projectsState.data,

        onGoToCreateProject,
        onGoToProject,
        onGoToProjectTokens
    }
}