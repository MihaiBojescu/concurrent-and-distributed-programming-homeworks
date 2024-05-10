import { useCallback, useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { PageState } from "../../components/page/types"
import { NotificationsContext } from "../../reducer/notifications/context"
import { TokensContext } from "../../reducer/tokens/context"

export const useCreateTokenPageLogic = () => {
    const [, notificationsDispatch] = useContext(NotificationsContext);
    const [tokensState, tokensDispatch] = useContext(TokensContext)
    const [pageState, setPageState] = useState<PageState>(PageState.Initial)
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState('')
    const [nameValid, setNameValid] = useState(true)
    const [description, setDescription] = useState('')
    const [descriptionValid, setDescriptionValid] = useState(true)
    const navigate = useNavigate()
    const params = useParams()

    const onSubmit = useCallback(() => {
        tokensDispatch({ type: 'create-token', data: { projectId: params.projectId!, name, description } });
        setPageState(PageState.Fetching)
    }, [params, name, description, tokensDispatch])

    const onGoToTokensList = useCallback(() => {
        navigate(`/app/projects/${params.projectId}/tokens`)
    }, [params, navigate])

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
                        title: 'Token creation error',
                        description: tokensState.createToken.error || ''
                    }
                })
                break
            case PageState.Successful:
                setDisabled(false)
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'positive',
                        title: 'Token creation succeeded',
                        description: 'Redirecting...'
                    }
                })
                onGoToTokensList()
                break
            default:
                setDisabled(false)
                break
        }
    }, [pageState, tokensState.createToken.error, notificationsDispatch, onGoToTokensList])

    useEffect(() => {
        if (pageState !== PageState.Initial && !tokensState.createToken.fetching) {
            if (tokensState.createToken.error) {
                setPageState(PageState.Failed);
            } else {
                setPageState(PageState.Successful);
            }
        }
    }, [pageState, tokensState.createToken]);

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
        onGoToTokensList,
    }
}