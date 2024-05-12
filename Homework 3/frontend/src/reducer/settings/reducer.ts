import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store";
import { Settings } from "./types";

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: () => {
        const existingTheme = localStorage.getItem('reducers/settings/theme')
        const existingFetching = localStorage.getItem('reducers/settings/fetching')
        let theme: Settings['theme'] = 'light'
        let fetching: Settings['fetching'] = {
            interval: 1000,
            instances: 60,
        }

        if (existingTheme) {
            theme = existingTheme as Settings['theme']
        }

        if (existingFetching) {
            try {
                fetching = JSON.parse(existingFetching) as Settings['fetching']
            } catch { }
        }

        return {
            theme,
            fetching
        }
    },
    selectors: {
        getSettings(state) {
            return state.fetching
        }
    },
    reducers: {},
    extraReducers(builder) {
        builder.addCase(setSettings.fulfilled, (state, action) => {
            state.theme = action.payload.theme
            state.fetching = action.payload.fetching

            localStorage.setItem('reducers/settings/theme', JSON.stringify(state.theme))
            localStorage.setItem('reducers/settings/fetching', JSON.stringify(state.fetching))
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
>('settings/setSettings', (arg) => {
    const root = document.querySelector(':root') as HTMLElement

    if (!root) {
        return arg
    }

    console.log({ arg })

    switch (arg.theme) {
        case 'light':
            root.style.setProperty('--white-color', 'hsl(20, 20%, 100%');
            root.style.setProperty('--lighter-color', 'hsl(20, 20%, 90%');
            root.style.setProperty('--light-color', 'hsl(20, 20%, 80%');
            root.style.setProperty('--normal-color', 'hsl(20, 20%, 60%');
            root.style.setProperty('--medium-color', 'hsl(20, 20%, 40%');
            root.style.setProperty('--dark-color', 'hsl(20, 20%, 20%');
            root.style.setProperty('--black-color', 'hsl(20, 20%, 0%');
            break
        case 'dark':
            root.style.setProperty('--white-color', 'hsl(20, 20%, 0%');
            root.style.setProperty('--lighter-color', 'hsl(20, 20%, 20%');
            root.style.setProperty('--light-color', 'hsl(20, 20%, 40%');
            root.style.setProperty('--normal-color', 'hsl(20, 20%, 60%');
            root.style.setProperty('--medium-color', 'hsl(20, 20%, 80%');
            root.style.setProperty('--dark-color', 'hsl(20, 20%, 90%');
            root.style.setProperty('--black-color', 'hsl(20, 20%, 100%');
            break
    }

    return arg
})
