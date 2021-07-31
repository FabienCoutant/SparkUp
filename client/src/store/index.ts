import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import notificationSlice from './Notification/slice';
import campaignSlice from './Campaign/slice';
import rewardSlice from './Reward/slice';
import userSlice from './User/slice'

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
});

const store = configureStore({
  reducer: {
    notification: notificationSlice.reducer,
    campaign: campaignSlice.reducer,
    reward: rewardSlice.reducer,
    user: userSlice.reducer
  },
  middleware: customizedMiddleware,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
