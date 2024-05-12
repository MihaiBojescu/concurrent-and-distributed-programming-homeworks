import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
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
    reducers: {},
    extraReducers(builder) {
        builder.addCase(setSettings.fulfilled, (state, action) => {
            state.fetching = action.payload.fetching
        })
    }
})

export const getSettings = settingsSlice.selectors.getSettings

export const setSettings = createAsyncThunk<
    Settings,
    Settings,
    {
        dispatch: AppDispatch,
        state: RootState
    }
>('settings/setSettings', (arg) => arg)
