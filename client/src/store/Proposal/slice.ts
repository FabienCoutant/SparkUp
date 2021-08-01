import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PROPOSAL_WORKFLOW_STATUS, Proposals, VOTING_TYPE } from '../../constants'

export interface proposal extends Proposals {
  onChain: boolean;
}

export interface proposalState {
  active: proposal[];
  archived: proposal[];
}

const initialState: proposalState = {
  active:[],
  archived:[]
}

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    addActiveProposal(state, action: PayloadAction<{ active:proposal }>) {
      state.active.push(action.payload.active)
    },
    addArchivedProposal(state, action: PayloadAction<{ proposal:proposal }>) {
      state.archived.push(action.payload.proposal)
    },
    updateProposal(state, action: PayloadAction<{ active: proposal, id: number }>) {
      state.active[action.payload.id] = action.payload.active
    },
    removeProposal(state, action: PayloadAction<{ id: number }>) {
      state.active.splice(action.payload.id, 1)
    },
    setActiveProposalState(state, action: PayloadAction<{ active:proposal[] }>) {
      state.active = [];
      for(const proposal of action.payload.active){
        state.active.push(proposal)
      }
    },
    setArchivedProposalState(state, action: PayloadAction<{ archived:proposal[] }>) {
      state.archived = [];
      for(const proposal of action.payload.archived){
        state.archived.push(proposal)
      }
    },
    addVote(state,action:PayloadAction<{votingPower:number,type:VOTING_TYPE,id:number}>){
      if(action.payload.type===VOTING_TYPE.OK){
        state.active[action.payload.id].okVotes=state.active[action.payload.id].okVotes+action.payload.votingPower
      }else{
        state.active[action.payload.id].nokVotes=state.active[action.payload.id].nokVotes+action.payload.votingPower
      }
    },
    withdraw(state,action:PayloadAction<{id:number}>){
      state.active[action.payload.id].amount=0
    },
    resetState:()=>initialState,
  }
})

export const proposalActions = proposalSlice.actions

export default proposalSlice
