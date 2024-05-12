import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Settings } from "./types";

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        fetching: {
            interval: 2000,
            instances: 60
        }
    },
    selectors: {
        getSettings(state) {
            return state
        }
    },
    reducers: {
        setSettings(state, action: PayloadAction<Settings>) {
            state.fetching = action.payload.fetching
        },
    }
})

export const getSettings = settingsSlice.selectors.getSettings
export const setSettings = settingsSlice.actions.setSettings
