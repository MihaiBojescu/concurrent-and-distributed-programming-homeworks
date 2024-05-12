import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { balancersSlice } from './balancers/reducer'
import { notificationsSlice } from './notifications/reducer'
import { settingsSlice } from './settings/reducer'

export const store = configureStore({
  reducer: {
    settingsSlice: settingsSlice.reducer,
    notifications: notificationsSlice.reducer,
    balancers: balancersSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
