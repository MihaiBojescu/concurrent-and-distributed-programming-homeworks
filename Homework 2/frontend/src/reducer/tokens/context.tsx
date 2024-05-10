import React, { createContext } from "react";
import { TokensActions, TokensState } from "./types";
import { tokensInitialState, tokensReducer, tokensSideEffects } from "./reducer";
import { useReducerWithSideEffects } from "../../hooks/useReducerWithSideEffects";
import { ManagedWebSocket } from "../../hooks/useWebSockets";

interface Props {
    websocket: ManagedWebSocket,
    children: React.ReactNode
}

export const TokensContext = createContext<readonly [TokensState, (action: TokensActions) => void]>([tokensInitialState, () => undefined])

export const TokensContextProvider: React.FC<Props> = ({ websocket, children }) => {
    const [state, dispatch] = useReducerWithSideEffects(tokensReducer, tokensSideEffects(websocket), tokensInitialState)

    return (
        <TokensContext.Provider value={[state, dispatch]}>
            {children}
        </TokensContext.Provider>
    )
}