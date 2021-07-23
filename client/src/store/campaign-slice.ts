import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Info } from '../constants/index';

export interface campaignState extends Info{
  confirmed: boolean;
  published: boolean;
  manager: string;
}

const initialState: campaignState = {
  title: "",
  description: "",
  fundingGoal: 10000,
  durationDays: new Date().setDate(Date.now()+7),
  confirmed: false,
  published: false,
  manager: "",
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaign(state, action: PayloadAction<campaignState>) {
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.fundingGoal = action.payload.fundingGoal;
      state.durationDays = action.payload.durationDays;
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
