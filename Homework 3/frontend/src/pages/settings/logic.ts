import { useNavigate } from "react-router-dom"

export const useSettingsPageLogic = () => {
    const navigate = useNavigate()

    const onClickBack = () => {
        navigate(-1)
    }

    return {
        onClickBack
    }
}