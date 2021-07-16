import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import uiSlice from './ui-slice';
import campaignSlice from './campaign-slice';
import rewardSlice from './reward-slice';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    campaign: campaignSlice.reducer,
    reward: rewardSlice.reducer,
  },
  middleware: customizedMiddleware,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
