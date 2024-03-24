import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../reducer/auth/context"

export const Root: React.FC = () => {
    const navigate = useNavigate()
    const [authState,] = useContext(AuthContext)

    useEffect(() => {
        if (!authState.authenticated) {
            navigate('/login')
        } else {
            navigate('/app')
        }
    }, [])

    return <></>
}