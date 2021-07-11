import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import uiSlice from './ui-slice';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
  middleware: customizedMiddleware,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
