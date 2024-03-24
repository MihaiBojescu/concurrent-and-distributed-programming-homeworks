import { useContext, useEffect } from "react"
import { AuthContext } from "../reducer/auth/context"
import { useNavigate } from "react-router-dom"

export const useAuthenticated = () => {
    const [authState, authDispatch] = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authState.loading) {
            authDispatch({ type: 'hydrate' })
        } else if (!authState.isAuthenticated) {
            navigate('/')
        }
    }, [authState])
}

export const useNotAuthenticated = () => {
    const [authState, authDispatch] = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (authState.loading) {
            authDispatch({ type: 'hydrate' })
        } else if (authState.isAuthenticated) {
            navigate('/')
        }
    }, [authState])
}