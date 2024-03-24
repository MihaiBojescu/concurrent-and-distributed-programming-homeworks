import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../reducer/auth/context"

export const Root: React.FC = () => {
    const navigate = useNavigate()
    const [authState, authDispatch] = useContext(AuthContext)

    useEffect(() => {
        if (authState.loading) {
            authDispatch({ type: 'hydrate' })
        } else {
            if (!authState.isAuthenticated) {
                navigate('/login')
            } else {
                navigate('/app')
            }
        }

    }, [authState])

    return <></>
}