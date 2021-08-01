import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Rewards } from '../../constants'

export interface reward extends Rewards {
  onChain: boolean;
  confirmed: boolean;
}

export interface rewardState {
  rewards: reward[];
}

const initialState: rewardState = {
  rewards: [
    {
      title: '',
      description: '',
      minimumContribution: 5,
      amount: 0,
      stockLimit: 0,
      nbContributors: 0,
      isStockLimited: false,
      onChain: false,
      confirmed: false
    }
  ]
}

const rewardSlice = createSlice({
  name: 'reward',
  initialState,
  reducers: {
    addReward(state, action: PayloadAction<{ reward:reward }>) {
        state.rewards.push(action.payload.reward)
    },
    updateReward(state, action: PayloadAction<{ reward: reward, id: number }>) {
      state.rewards[action.payload.id] = action.payload.reward
    },
    setConfirmed(state, action: PayloadAction<{ id: number, confirmed: boolean }>) {
      state.rewards[action.payload.id].confirmed = action.payload.confirmed
    },
    removeReward(state, action: PayloadAction<{ id: number }>) {
      state.rewards.splice(action.payload.id, 1)
    },
    setState(state, action: PayloadAction<rewardState>) {
      state.rewards = [];
      for(const reward of action.payload.rewards){
        state.rewards.push(reward)
      }
    },
    addContribution(state,action:PayloadAction<{amount:number,id:number}>){
      state.rewards[action.payload.id].nbContributors ++
      state.rewards[action.payload.id].amount=state.rewards[action.payload.id].amount as number +action.payload.amount
    },
    resetState:()=>initialState,
  }
})

export const rewardActions = rewardSlice.actions

export default rewardSlice
