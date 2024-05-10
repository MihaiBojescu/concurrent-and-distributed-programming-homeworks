import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { PageState } from "../../components/page/types"
import { NotificationsContext } from "../../reducer/notifications/context"
import { ProjectsContext } from "../../reducer/projects/context"

export const useCreateProjectPageLogic = () => {
    const [, notificationsDispatch] = useContext(NotificationsContext);
    const [projectsState, projectsDispatch] = useContext(ProjectsContext)
    const [pageState, setPageState] = useState<PageState>(PageState.Initial)
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState('')
    const [nameValid, setNameValid] = useState(true)
    const [description, setDescription] = useState('')
    const [descriptionValid, setDescriptionValid] = useState(true)
    const navigate = useNavigate()
    
    const onSubmit = useCallback(() => {
        projectsDispatch({ type: 'create-project', data: { name, description } });
        setPageState(PageState.Fetching)
    }, [name, description, projectsDispatch])

    const onGoToProjectsList = useCallback(() => {
        navigate(`/app/projects`)
    }, [navigate])
    
    useEffect(() => {
        setNameValid(name.length > 0 && name.length < 65);
        setDescriptionValid(description.length < 257);
    }, [name, description]);

    useEffect(() => {
        if (nameValid && descriptionValid) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [nameValid, descriptionValid])

    useEffect(() => {
        switch (pageState) {
            case PageState.Loading:
            case PageState.Fetching:
                setDisabled(true)
                break
            case PageState.Failed:
                setDisabled(false)
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'negative',
                        title: 'Project creation error',
                        description: projectsState.createProject.error || ''
                    }
                })
                break
            case PageState.Successful:
                setDisabled(false)
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'positive',
                        title: 'Project creation succeeded',
                        description: 'Redirecting...'
                    }
                })
                onGoToProjectsList()
                break
            default:
                setDisabled(false)
                break
        }
    }, [pageState, projectsState.createProject.error, notificationsDispatch, onGoToProjectsList])

    useEffect(() => {
        if (pageState !== PageState.Initial && !projectsState.createProject.fetching) {
            if (projectsState.createProject.error) {
                setPageState(PageState.Failed);
            } else {
                setPageState(PageState.Successful);
            }
        }
    }, [pageState, projectsState.createProject]);

    return {
        name,
        setName,
        description,
        setDescription,
        
        fetching: pageState === PageState.Fetching,
        disabled,

        nameValid,
        descriptionValid,

        onSubmit,
        onGoToProjectsList,
    }
}