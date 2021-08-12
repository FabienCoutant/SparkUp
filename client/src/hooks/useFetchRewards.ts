import { Rewards } from '../constants'
import { useActiveWeb3React } from './useWeb3'
import { useContractCampaign } from './useContract'
import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { reward, rewardActions } from '../store/Reward/slice'
import { serializeUSDCFor } from '../utils/serializeValue'

export const useFetchRewardsList = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractCampaign = useContractCampaign(address)
  useEffect(() => {
    const fetchRewards = async () => {
      if (contractCampaign && chainId && library) {
        const rewards:reward[] = []
        const rewardCounter = await contractCampaign?.methods?.rewardsCounter().call()
        for (let i = 0; i < rewardCounter; i++) {
          const res:Rewards = await contractCampaign?.methods?.rewardsList(i).call()
          const reward = {
            title:res.title,
            description:res.description,
            minimumContribution:serializeUSDCFor(res.minimumContribution,false),
            amount: serializeUSDCFor(res.amount,false),
            stockLimit: res.stockLimit,
            nbContributors: res.nbContributors,
            isStockLimited: res.isStockLimited,
            onChain: true,
            confirmed: true
          }
          rewards.push(reward);
        }
        dispatch(rewardActions.setState({ rewards } ))
      }
    }
    fetchRewards()
  }, [contractCampaign, chainId, library, address,dispatch]);
}
