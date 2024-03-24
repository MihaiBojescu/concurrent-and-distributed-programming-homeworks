import { useContext, useEffect } from "react"
import { AuthContext } from "../reducer/auth/context"
import { useNavigate } from "react-router-dom"

export const useAuthenticated = () => {
    const [state,] = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!state.authenticated) {
            navigate('/')
        }
    }, [])
}

export const useNotAuthenticated = () => {
    const [state,] = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (state.authenticated) {
            navigate('/')
        }
    }, [])
}