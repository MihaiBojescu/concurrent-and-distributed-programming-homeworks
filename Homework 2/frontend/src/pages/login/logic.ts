import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageState } from "../../components/page/types";
import { NotificationsContext } from "../../reducer/notifications/context";
import { UsersContext } from "../../reducer/users/context";

export const useLoginLogic = () => {
    const [usersState, usersDispatch] = useContext(UsersContext);
    const [, notificationsDispatch] = useContext(NotificationsContext);
    const [pageState, setPageState] = useState<PageState>(PageState.Initial);
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        usersDispatch({ type: 'login', data: { email, password } });
        setPageState(PageState.Fetching);
    };

    const onGoToCreateUserClick = () => {
        navigate('/register');
    };

    useEffect(() => {
        switch (pageState) {
            case PageState.Loading:
            case PageState.Fetching:
                setDisabled(true);
                break;
            case PageState.Failed:
                setDisabled(false);
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'negative',
                        title: 'Login error',
                        description: usersState.login.error || ''
                    }
                });
                break;
            case PageState.Successful:
                setDisabled(false);
                notificationsDispatch({
                    type: 'notifications-add',
                    data: {
                        type: 'positive',
                        title: 'Login succeeded',
                        description: 'Redirecting...'
                    }
                });
                navigate('/');
                break;
            default:
                setDisabled(false);
        }
    }, [pageState]);

    useEffect(() => {
        if (pageState !== PageState.Initial) {
            if (!usersState.login.fetching && usersState.login.error) {
                setPageState(PageState.Failed);
            } else if (!usersState.login.fetching && !usersState.login.error && usersState.login.data) {
                setPageState(PageState.Successful);
            }
        }
    }, [usersState.login.fetching, usersState.login.error]);

    return {
        email,
        setEmail,
        password,
        setPassword,

        fetching: pageState === PageState.Fetching,
        disabled,

        onSubmit,
        onGoToCreateUserClick
    };
};
