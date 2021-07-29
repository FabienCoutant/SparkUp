import { reward } from '../store/Reward/slice'

export const hasAtLeastNbRewardsOnChain = (rewards: reward[], minNb: number) => {
  let calNb:number=0
  for (const reward of rewards) {
    if (reward.onChain) {
      calNb++
    }
  }
  return calNb >= minNb
}

export const hasAtLeastNbRewardsConfirmed = (rewards: reward[], minNb: number) => {
  let calNb:number=0
  for (const reward of rewards) {
    if (reward.confirmed) {
      calNb++
    }
  }
  return calNb >= minNb
}
