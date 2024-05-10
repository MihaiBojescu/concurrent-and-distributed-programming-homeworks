import { useNavigate } from "react-router-dom"
import { useTimeout } from "../../hooks/useTimeout"
import { useEffect } from "react"

export const useNotFoundPage = () => {
    const navigate = useNavigate()

    const timeout = useTimeout(2000, () => {
        navigate('/')
    }, [])

    useEffect(() => {
        timeout.start()
    }, [])
}