import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Notification } from "./types";
import { WithIdentifier } from "../common/types";

export const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [] as WithIdentifier<Notification>[]
    },
    selectors: {
        getNotifications(state) {
            return state.notifications
        }
    },
    reducers: {
        addNotification(state, action: PayloadAction<Notification>) {
            state.notifications.push({
                ...action.payload,
                id: window.crypto.randomUUID()
            })
        },
        removeNotification(state, action: PayloadAction<{ id: string }>) {
            const index = state.notifications.findIndex(item => item.id === action.payload.id);

            if (index === -1) {
                return
            }

            state.notifications.splice(index, 1)
        },
    }
})

export const getNotifications = notificationsSlice.selectors.getNotifications
export const addNotification = notificationsSlice.actions.addNotification
export const removeNotification = notificationsSlice.actions.removeNotification
