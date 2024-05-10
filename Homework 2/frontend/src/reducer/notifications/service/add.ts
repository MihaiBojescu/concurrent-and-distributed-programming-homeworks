import { NotificationsAddAction, NotificationsState } from "../types"

export const addHandler = (state: NotificationsState, action: NotificationsAddAction): NotificationsState => ({
    ...state,
    notifications: [...state.notifications, { ...action.data, id: window.crypto.randomUUID() }]
})

