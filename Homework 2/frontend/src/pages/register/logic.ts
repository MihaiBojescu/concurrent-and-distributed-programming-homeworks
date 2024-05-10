import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageState } from "../../components/page/types";
import { NotificationsContext } from "../../reducer/notifications/context";
import { UsersContext } from "../../reducer/users/context";

export const useRegisterLogic = () => {
    const [usersState, usersDispatch] = useContext(UsersContext);
    const [, notificationsDispatch] = useContext(NotificationsContext);
    const [pageState, setPageState] = useState<PageState>(PageState.Initial)
    const [disabled, setDisabled] = useState(true);
    const [name, setName] = useState('');
    const [nameValid, setNameValid] = useState(true);
    const [email, setEmail] = useState('');
    const [emailValid, setEmailValid] = useState(true);
    const [password, setPassword] = useState('');
    const [passwordValid, setPasswordValid] = useState(true);
    const navigate = useNavigate();

    const onSubmit = useCallback(() => {
        usersDispatch({ type: 'create-user', data: { email, name, password } });
        setPageState(PageState.Fetching)
    }, [email, name, password, usersDispatch])

    const onGoToLoginClick = useCallback(() => {
        navigate('/login');
    }, [navigate])

    useEffect(() => {
        setNameValid(name.length > 2 && name.length < 65);
        setEmailValid(/.+?@.+?\..+?/.test(email) && email.length < 65);
        setPasswordValid(password.length > 7 && password.length < 65);
    }, [email, name, password]);

    useEffect(() => {
        if (nameValid && emailValid && passwordValid) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [nameValid, emailValid, passwordValid])

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
                        title: 'User creation error',
                        description: usersState.createUser.error || ''
                    }
                })
                break
            case PageState.Successful:
                setDisabled(false)
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'positive',
                        title: 'User creation succeeded',
                        description: 'Navigating back to login page'
                    }
                })
                onGoToLoginClick()
                break
            default:
                setDisabled(false)
        }
    }, [pageState, usersState.createUser.error, notificationsDispatch, onGoToLoginClick])

    useEffect(() => {
        if (pageState !== PageState.Initial) {
            if (!usersState.createUser.fetching && usersState.createUser.error) {
                setPageState(PageState.Failed);
            } else if (!usersState.createUser.fetching && !usersState.createUser.error && usersState.createUser.data) {
                setPageState(PageState.Successful);
            }
        }
    }, [pageState, usersState.createUser]);

    return {
        email,
        setEmail,
        name,
        setName,
        password,
        setPassword,

        fetching: pageState === PageState.Fetching,
        disabled,

        emailValid,
        nameValid,
        passwordValid,

        onSubmit,
        onGoToLoginClick
    };
};
