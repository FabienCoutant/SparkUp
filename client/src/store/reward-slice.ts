import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface reward {
  id: number;
  title: string | null;
  description: string | null;
  value: number | null;
  confirmed: boolean | null;
}

interface rewardState {
  rewards: reward[];
}

const initialState: rewardState = {
  rewards: [
    {
      id: 0,
      title: null,
      description: null,
      value: null,
      confirmed: false,
    },
  ],
};

const rewardSlice = createSlice({
  name: 'reward',
  initialState,
  reducers: {
    addReward(state, action: PayloadAction<reward>) {
      if (state.rewards[action.payload.id]) {
        state.rewards[action.payload.id] = action.payload;
      } else {
        state.rewards.push(action.payload);
      }
    },
    removeReward(state, action: PayloadAction<{ id: number }>) {
      const tempRewards = state.rewards.slice(action.payload.id + 1);
      tempRewards.forEach((reward) => {
        reward.id--;
      });
      const newReward = [...state.rewards, ...tempRewards];
      state.rewards = newReward;
    },
  },
});

export const rewardActions = rewardSlice.actions;

export default rewardSlice;
