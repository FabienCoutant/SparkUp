import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PROPOSAL_WORKFLOW_STATUS, Proposals, VOTING_TYPE } from '../../constants'

export interface proposal extends Proposals {
  onChain: boolean;
  confirmed: boolean;
}

export interface proposalState {
  proposals: proposal[];
}

const initialState: proposalState = {
  proposals: [
    {
      title: '',
      description: '',
      amount: 0,
      okVotes:0,
      nokVotes:0,
      status:PROPOSAL_WORKFLOW_STATUS.Pending,
      deadLine: new Date().setDate(new Date().getDate() + 7),
      accepted: false,
      onChain:false,
      confirmed:false
    }
  ]
}

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    addProposal(state, action: PayloadAction<{ proposal:proposal }>) {
      state.proposals.push(action.payload.proposal)
    },
    updateProposal(state, action: PayloadAction<{ proposal: proposal, id: number }>) {
      state.proposals[action.payload.id] = action.payload.proposal
    },
    setConfirmed(state, action: PayloadAction<{ id: number, confirmed: boolean }>) {
      state.proposals[action.payload.id].confirmed = action.payload.confirmed
    },
    removeProposal(state, action: PayloadAction<{ id: number }>) {
      state.proposals.splice(action.payload.id, 1)
    },
    setState(state, action: PayloadAction<proposalState>) {
      state.proposals = [];
      for(const reward of action.payload.proposals){
        state.proposals.push(reward)
      }
    },
    addVote(state,action:PayloadAction<{votingPower:number,type:VOTING_TYPE,id:number}>){
      if(action.payload.type===VOTING_TYPE.OK){
        state.proposals[action.payload.id].okVotes=state.proposals[action.payload.id].okVotes+action.payload.votingPower
      }else{
        state.proposals[action.payload.id].nokVotes=state.proposals[action.payload.id].nokVotes+action.payload.votingPower
      }
    },
    withdraw(state,action:PayloadAction<{id:number}>){
      state.proposals[action.payload.id].amount=0
    },
    resetState:()=>initialState,
  }
})

export const proposalActions = proposalSlice.actions

export default proposalSlice
