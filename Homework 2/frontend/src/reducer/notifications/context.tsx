import React, { createContext, useReducer } from "react";
import { NotificationsActions, NotificationsState } from "./types";
import { notificationsInitialState, notificationsReducer } from "./reducer";

interface Props {
    children: React.ReactNode
}

export const NotificationsContext = createContext<readonly [NotificationsState, (action: NotificationsActions) => void]>([notificationsInitialState, () => undefined])

export const NotificationsContextProvider: React.FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(notificationsReducer, notificationsInitialState)

    return (
        <NotificationsContext.Provider value={[state, dispatch]}>
            {children}
        </NotificationsContext.Provider>
    )
}