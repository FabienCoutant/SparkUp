import { useState } from 'react'
import { rewardActions } from '../../store/Reward/slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { HANDLE_REWARD_FORM_TYPE, REWARD_FORM_SUBMIT_MESSAGE, Rewards } from '../../constants'
import { useLocation, useParams } from 'react-router'
import { useContractCampaign } from '../../hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import RewardForm from '../RewardForm'
import { useIsManager } from '../../hooks/useFetchCampaign'


const Reward = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const campaign = useAppSelector((state) => state.campaign)
  const rewards = useAppSelector((state) => state.reward.rewards)
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)
  const isManager: boolean = useIsManager()


  const changeRewardHandler = () => {
    dispatch(
      rewardActions.setConfirmed({
        id,
        confirmed: false
      })
    )
  }

  const removeRewardHandler = async () => {
    if (!campaign.published) {
      dispatch(rewardActions.removeReward({ id }))
    } else {
      contractCampaign?.methods.deleteReward(id).send({ from: account })
    }
  }

  const handleUpdateReward = (): void => {
    changeRewardHandler()
  }

  const submitUpdateReward = (
    title: string,
    description: string,
    minimumContribution: number,
    stockLimit: number,
    isStockLimited: boolean,
    rewardId: number) => {
    const newReward: Rewards = {
      title,
      description,
      minimumContribution,
      amount: 0,
      stockLimit,
      nbContributors: 0,
      isStockLimited
    }

    contractCampaign?.methods?.updateReward(newReward, rewardId).send({ from: account })
  }


  const submitRewardHandler = async () => {
    const newReward: Rewards = {
      title: rewards[id].title,
      description: rewards[id].description,
      minimumContribution: rewards[id].minimumContribution,
      amount: rewards[id].amount,
      stockLimit: rewards[id].stockLimit,
      nbContributors: rewards[id].nbContributors,
      isStockLimited: rewards[id].isStockLimited
    }
    if (contractCampaign && newReward.title && newReward.description) {
      try {
        await contractCampaign?.methods
          .addReward(newReward)
          .send({ from: account })
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div className='card'>
      {!rewards[id].confirmed && <RewardForm id={id} rewards={rewards[id]}/>}
      {rewards[id].confirmed && (
        <div className='card-body'>
          <h5 className='card-title'>Reward {id + 1}</h5>
          <div className='list-inline'>
            <label
              htmlFor='rewardTitle'
              className='form-label list-inline-item'
            >
              Reward Title :
            </label>
            <h5 className='card-title list-inline-item' id='rewardTitle'>
              {rewards[id].title}
            </h5>
          </div>
          <label htmlFor='rewardDescription' className='form-label'>
            Reward Description :
          </label>
          <p className='card-text' id='rewardDescription'>
            {rewards[id].description}
          </p>
          <div className='list-inline'>
            <label
              className='form-label list-inline-item'
              htmlFor='rewardMinimumContribution'
            >
              Minimum Contribution (USDC) :
            </label>
            <h6
              className='card-subtitle mb-2 list-inline-item'
              id='rewardMiniumContribution'
            >
              {rewards[id].minimumContribution} USDC
            </h6>
          </div>
          <div className='list-inline'>
            <label
              className='form-label list-inline-item'
              htmlFor='rewardIsStockLimit'
            >
              Minimum Contribution (USDC) :
            </label>
            <h6
              className='card-subtitle mb-2 list-inline-item'
              id='rewardIsStockLimit'
            >
              {rewards[id].isStockLimited ? 'Yes' : 'No'}
            </h6>
          </div>
          {rewards[id].isStockLimited && (
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='rewardStockLimit'
              >
                Inventory :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='rewardStockLimit'
              >
                {rewards[id].stockLimit}
              </h6>
            </div>
          )}
          <div className='list-inline'>
            {!rewards[id].published && (
              <button
                className='btn btn-primary'
                type='button'
                onClick={() => changeRewardHandler()}
              >
                Modify Reward
              </button>
            )}
            {rewards[id].published && isManager && (
              <>
                {rewards[id].confirmed &&
                <button className='btn btn-primary me-3'
                        type='button'
                        onClick={() => handleUpdateReward()}>
                  Update Reward
                </button>
                }
                {!rewards[id].confirmed &&
                <button className='btn btn-primary me-3'
                        type='button'
                        onClick={() => handleUpdateReward()}>
                  Validate update Reward
                </button>
                }
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={() => removeRewardHandler()}
                >
                  Remove Reward
                </button>
              </>
            )}
            {!rewards[id].published && !campaign.published && (

              <button
                type='button'
                className='btn btn-primary ms-3'
                onClick={() => removeRewardHandler()}
                disabled={rewards.length < 2}
              >
                Remove Reward
              </button>

            )}
            {!rewards[id].published && campaign.published &&
            <button
              className='btn btn-primary ms-3'
              type='button'
              onClick={() => submitRewardHandler()}
            >
              Submit Reward
            </button>
            }
          </div>
        </div>
      )}
    </div>
  )
}

export default Reward
