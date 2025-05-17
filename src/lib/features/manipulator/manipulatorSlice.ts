import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface CommandHistoryItem {
  originalCommand: string
  optimizedCommand: string
  timestamp: string
  initialState: string
  finalState: string
}

interface ManipulatorState {
  commandHistory: CommandHistoryItem[]
}

const initialState: ManipulatorState = {
  commandHistory: [],
}

export const manipulatorSlice = createSlice({
  name: "manipulator",
  initialState,
  reducers: {
    addCommandHistory: (state, action: PayloadAction<CommandHistoryItem>) => {
      state.commandHistory.unshift(action.payload)
    },
  },
})

export const { addCommandHistory } = manipulatorSlice.actions

export default manipulatorSlice.reducer
