import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface campaignState {
  title: string | null;
  description: string | null;
  fundingGoal: number | null;
  deadline: Date | null;
  confirmed: boolean | null;
}

const initialState: campaignState = {
  title: null,
  description: null,
  fundingGoal: null,
  deadline: null,
  confirmed: false,
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
    },
    setConfirmed(state, action: PayloadAction<{ confirmed: boolean }>) {
      state.confirmed = action.payload.confirmed;
    },
  },
});

export const campaignActions = campaignSlice.actions;

export default campaignSlice;
