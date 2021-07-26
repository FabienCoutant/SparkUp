import { Rewards } from '../constants'
import { useActiveWeb3React } from './useWeb3'
import { useContractCampaign } from './useContract'
import { useMemo } from 'react'


export const useFetchRewardsList = (address: string): Rewards[] => {
  const { library, chainId } = useActiveWeb3React()
  const contractCampaign = useContractCampaign(address)
  const rewards: Rewards[] = []
  return useMemo(() => {
    if (contractCampaign && chainId && library) {
      const rewardCounter = contractCampaign?.methods?.rewardsCounter().call()
      for (let i = 0; i < rewardCounter; i++) {
        const reward = contractCampaign?.methods?.rewardsList(i).call()
        rewards.push(reward)
      }
    }
    return rewards
  }, [contractCampaign, chainId, library, address])
}
