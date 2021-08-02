import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PROPOSAL_WORKFLOW_STATUS, Proposals, VOTING_TYPE } from '../../constants'

export interface proposal extends Proposals {
  onChain: boolean;
}

export interface proposalState {
  active: proposal[];
  archived: proposal[];
  availableFunds: number | string
}

const initialState: proposalState = {
  active: [],
  archived: [],
  availableFunds: 0
}

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    addActiveProposal(state, action: PayloadAction<{ active: proposal }>) {
      state.active.push(action.payload.active)
    },
    addArchivedProposal(state, action: PayloadAction<{ proposal: proposal }>) {
      state.archived.push(action.payload.proposal)
    },
    updateProposal(state, action: PayloadAction<{ active: proposal, id: number }>) {
      state.active[action.payload.id] = action.payload.active
    },
    createProposal(state, action: PayloadAction<{ active: proposal, id: number }>) {
      state.active[action.payload.id] = action.payload.active
      state.availableFunds = state.availableFunds as number - (action.payload.active.amount as number)
    },
    removeProposal(state, action: PayloadAction<{ id: number }>) {
      state.availableFunds = state.availableFunds as number + (state.active[action.payload.id].amount as number)
      state.active.splice(action.payload.id, 1)
    },
    cancelProposal(state, action: PayloadAction<{ id: number }>) {
      state.active.splice(action.payload.id, 1)
    },
    moveActiveToArchived(state,action:PayloadAction<{ id: number }>){
      let newArchived = { ...state.active[action.payload.id], status: PROPOSAL_WORKFLOW_STATUS.VotesTallied }
      if (state.active[action.payload.id].okVotes >= state.active[action.payload.id].nokVotes) {
        newArchived = { ...newArchived, accepted: true }
      }
      state.active.splice(action.payload.id, 1)
      state.archived.push(newArchived)
    },
    setActiveProposalState(state, action: PayloadAction<{ active: proposal[] }>) {
      state.active = []
      for (const proposal of action.payload.active) {
        state.active.push(proposal)
      }
    },
    setArchivedProposalState(state, action: PayloadAction<{ archived: proposal[] }>) {
      state.archived = []
      for (const proposal of action.payload.archived) {
        state.archived.push(proposal)
      }
    },
    addVote(state, action: PayloadAction<{ votingPower: number, type: VOTING_TYPE, id: number }>) {
      if (action.payload.type === VOTING_TYPE.OK) {
        state.active[action.payload.id].okVotes = state.active[action.payload.id].okVotes + action.payload.votingPower
      } else {
        state.active[action.payload.id].nokVotes = state.active[action.payload.id].nokVotes + action.payload.votingPower
      }
    },
    withdraw(state, action: PayloadAction<{ id: number }>) {
      state.active[action.payload.id].amount = 0
    },
    setAvailableFunds(state, action: PayloadAction<{ availableFunds: number | string }>) {
      state.availableFunds = action.payload.availableFunds
    },
    resetState: () => initialState
  }
})

export const proposalActions = proposalSlice.actions

export default proposalSlice
