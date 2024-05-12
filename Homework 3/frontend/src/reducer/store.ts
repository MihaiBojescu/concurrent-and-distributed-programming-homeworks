import { configureStore } from '@reduxjs/toolkit'
import { balancersSlice } from './balancers/reducer'
import { useDispatch, useSelector } from 'react-redux'
import { notificationsSlice } from './notifications/reducer'

export const store = configureStore({
  reducer: {
    notifications: notificationsSlice.reducer,
    balancers: balancersSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
