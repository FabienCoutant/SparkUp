import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Info } from '../constants/index';

export interface campaignState {
  title: string | null;
  description: string | null;
  fundingGoal: number | null;
  deadline: any;
  confirmed: boolean | null;
  published: boolean | null;
  manager: string | null;
}

const initialState: campaignState = {
  title: null,
  description: null,
  fundingGoal: null,
  deadline: null,
  confirmed: false,
  published: null,
  manager: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaign(state, action: PayloadAction<campaignState>) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.fundingGoal = action.payload.fundingGoal;
      state.deadline = action.payload.deadline;
      state.confirmed = action.payload.confirmed;
      state.published = action.payload.published;
      state.manager = action.payload.manager;
    },
    setConfirmed(state, action: PayloadAction<{ confirmed: boolean }>) {
      state.confirmed = action.payload.confirmed;
    },
  },
});

export const campaignActions = campaignSlice.actions;

export default campaignSlice;
