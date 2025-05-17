import { configureStore } from "@reduxjs/toolkit"
import manipulatorReducer from "./features/manipulator/manipulatorSlice"

export const store = configureStore({
  reducer: {
    manipulator: manipulatorReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
