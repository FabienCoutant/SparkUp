import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Info } from '../../constants'

export interface campaignState {
  info: Info
  confirmed: boolean;
  published: boolean;
  manager: string;
  createAt: number;
}

export const initialState: campaignState = {
  info: {
    title: '',
    description: '',
    fundingGoal: 10000,
    deadlineDate: new Date().setDate(new Date().getDate() + 7)
  },
  confirmed: false,
  published: false,
  manager: '',
  createAt: new Date().getTime()
}

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaign(state, action: PayloadAction<campaignState>) {
      state.info.title = action.payload.info.title
      state.info.description = action.payload.info.description
      state.info.fundingGoal = action.payload.info.fundingGoal
      state.info.deadlineDate = action.payload.info.deadlineDate
      state.confirmed = action.payload.confirmed
      state.published = action.payload.published
      state.manager = action.payload.manager
      state.createAt = action.payload.createAt
    },
    setConfirmed(state, action: PayloadAction<{ confirmed: boolean }>) {
      state.confirmed = action.payload.confirmed
    }
  }
})

export const campaignActions = campaignSlice.actions

export default campaignSlice
