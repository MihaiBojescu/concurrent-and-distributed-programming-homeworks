import { configureStore } from '@reduxjs/toolkit'
import { balancersSlice } from './balancers/reducer'

export const store = configureStore({
  reducer: {
    balancers: balancersSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
