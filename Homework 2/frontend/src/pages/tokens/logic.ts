import { useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TokensContext } from "../../reducer/tokens/context";


export const useTokensPageLogic = () => {
    const [tokensState, ] = useContext(TokensContext);
    const navigate = useNavigate();
    const params = useParams()

    const onGoToCreateProjectToken = useCallback(() =>  {
        navigate(`/app/projects/${params.projectId}/tokens/create`)
    }, [params, navigate])

    const onGoToProjectsList = useCallback(() => {
        navigate(`/app/projects`);
    }, [navigate])

    return {
        tokens: tokensState.data[params.projectId!] || [],

        onGoToCreateProjectToken,
        onGoToProjectsList
    }
}