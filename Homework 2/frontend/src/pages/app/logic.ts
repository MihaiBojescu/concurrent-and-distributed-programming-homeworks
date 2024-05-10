import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const useAppPageLogic = () => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/app/projects')
    }, [navigate])
}
