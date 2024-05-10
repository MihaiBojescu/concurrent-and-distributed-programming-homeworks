import { CardList } from "../../components/card/cardList";
import { Header } from "../../components/header/header";
import { Page } from "../../components/page/page";
import { AddMoreProjects } from "../../components/projects/addMoreProjects";
import { NewProject } from "../../components/projects/newProject";
import { Project } from "../../components/projects/project";
import { useProjectsPageLogic } from "./logic";

export const Projects: React.FC = () => {
    const logic = useProjectsPageLogic()

    return (
        <>
            <Header />
            <Page centered>
                {
                    logic.projects.length === 0 && (
                        <NewProject onGoToCreateProject={logic.onGoToCreateProject} />
                    )
                }
                {
                    logic.projects.length > 0 && (
                        <CardList>
                            <>
                                {
                                    logic.projects.map(project => (
                                        <Project
                                            key={project.project_id}
                                            projectId={project.project_id}
                                            userId={project.user_id}
                                            name={project.name}
                                            description={project.description}
                                            onGoToProject={logic.onGoToProject(project.project_id)}
                                            onGoToProjectTokens={logic.onGoToProjectTokens(project.project_id)}
                                        />
                                    ))
                                }
                                <AddMoreProjects onGoToCreateProject={logic.onGoToCreateProject} />
                            </>
                        </CardList>
                    )
                }
            </Page>
        </>
    );
};
