import { configureStore } from '@reduxjs/toolkit'
import yourReducer from '../features/yourSlice'

export const store = configureStore({
  reducer: {
    yourFeature: yourReducer,
  },
})
