import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface uiState {
  display: boolean | null;
  message: string | null;
  type: string | null;
}

const initialState: uiState = {
  display: null,
  message: null,
  type: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setNotification(
      state,
      action: PayloadAction<{ message: string; type: string }>
    ) {
      state.display = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    hideNotification(state) {
      state.display = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;
