import { useContext, useEffect, useState } from "react"
import { Page } from "../../components/page/page"
import { AuthContext } from "../../reducer/auth/context"
import { useNavigate } from "react-router-dom"
import { Card } from "../../components/card/card"
import { H1 } from "../../components/typography/h1"
import { TextField } from "../../components/input/textfield"
import { Button } from "../../components/input/button"
import { Image } from "../../components/image/image"
import { Spin } from "../../components/animate/spin"

export const Login: React.FC = () => {
    const [authState, authDispatch] = useContext(AuthContext)
    const [disabled, setDisabled] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const onClick = () => {
        authDispatch({ type: 'login', credentials: { username, password } })
    }

    useEffect(() => {
        if (authState.isAuthenticated) {
            navigate('/')
        }
    }, [])

    useEffect(() => {
        if (authState.fetching) {
            setDisabled(true)
        }
    }, [authState])

    return (
        <Page centered={true}>
            <Card>
                <H1>Login</H1>
                <TextField value={username} onChange={setUsername} placeholder="Username" />
                <TextField value={password} onChange={setPassword} placeholder="Password" />
                <Button onClick={onClick} disabled={disabled}>
                    {!authState.fetching ? 'Submit' : <Spin><Image id="gear" /></Spin>}
                </Button>
            </Card>
        </Page>
    )
}