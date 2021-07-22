import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface reward {
  id: number;
  title: string | null;
  description: string | null;
  minimumContribution: number | null;
  amount: number | null;
  stockLimit: number | null;
  nbContributors: number | null;
  isStockLimited: boolean | null;
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
      minimumContribution: null,
      amount: 0,
      stockLimit: null,
      nbContributors: 0,
      isStockLimited: null,
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
    setConfirmed(
      state,
      action: PayloadAction<{ id: number; confirmed: boolean }>
    ) {
      state.rewards[action.payload.id].confirmed = action.payload.confirmed;
    },
    removeReward(state, action: PayloadAction<{ id: number }>) {
      state.rewards.splice(action.payload.id, 1);
      for (let i = action.payload.id; i < state.rewards.length; i++) {
        state.rewards[i].id--;
      }
    },
    setState(state, action: PayloadAction<{ newState: reward }>) {
      state.rewards = [action.payload.newState];
    },
  },
});

export const rewardActions = rewardSlice.actions;

export default rewardSlice;
