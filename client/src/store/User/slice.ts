import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface userState {
  balance: number;
}

const initialState: userState = {
  balance: 0
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<{ balance: number }>) {
      state.balance = action.payload.balance
    },
    addBalance(state, action: PayloadAction<{ balance: number }>) {
      state.balance = state.balance + action.payload.balance
    },
    subBalance(state, action: PayloadAction<{ balance: number }>) {
      state.balance = state.balance - action.payload.balance
    }
  }
})


export const userActions = userSlice.actions

export default userSlice
