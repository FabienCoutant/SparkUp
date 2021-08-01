import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { campaignState, Info, WORKFLOW_STATUS, ZERO_ADDRESS } from '../../constants'
import { serializeTimestampsFor } from '../../utils/dateHelper'
import { serializeUSDCFor } from '../../utils/serializeValue'


export const initialState: campaignState = {
  info: {
    title: '',
    description: '',
    fundingGoal: 1000,
    deadlineDate: new Date().setDate(new Date().getDate() + 7)
  },
  confirmed: false,
  onChain: false,
  manager: '',
  createAt: new Date().getTime(),
  amountRaise: 0,
  currentBalance:0,
  workflowStatus: WORKFLOW_STATUS.CampaignDrafted,
  proposalAddress: ZERO_ADDRESS
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
      state.onChain = action.payload.onChain
      state.manager = action.payload.manager
      state.createAt = action.payload.createAt
      state.amountRaise = action.payload.amountRaise
      state.currentBalance = action.payload.currentBalance
      state.workflowStatus = action.payload.workflowStatus
      state.proposalAddress=action.payload.proposalAddress
    },
    setConfirmed(state, action: PayloadAction<{ confirmed: boolean }>) {
      state.confirmed = action.payload.confirmed
    },
    setWorkflow(state,action:PayloadAction<{workflowStatus:WORKFLOW_STATUS}>){
      state.workflowStatus = action.payload.workflowStatus
    },
    updateCampaign(state,action:PayloadAction<{campaignInfo:Info}>){
      state.info.title = action.payload.campaignInfo.title
      state.info.description = action.payload.campaignInfo.description
      state.info.fundingGoal = serializeUSDCFor(action.payload.campaignInfo.fundingGoal,false)
      state.info.deadlineDate = serializeTimestampsFor(action.payload.campaignInfo.deadlineDate,false)
      state.confirmed=true
    },
    addFunding(state,action:PayloadAction<{amount:number}>){
      console.log(state.amountRaise)
      state.amountRaise = state.amountRaise as number+action.payload.amount
    },
    subFunding(state,action:PayloadAction<{amount:number}>){
      state.amountRaise = state.amountRaise as number-action.payload.amount
    },
    resetState : () => initialState,
  }
})

export const campaignActions = campaignSlice.actions

export default campaignSlice
