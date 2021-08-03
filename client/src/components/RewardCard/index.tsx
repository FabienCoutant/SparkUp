import { rewardActions } from '../../store/Reward/slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { NOTIFICATION_TYPE, RENDER_TYPE, WORKFLOW_STATUS, ZERO_ADDRESS } from '../../constants'
import { useParams } from 'react-router'
import { useContractCampaign } from '../../hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { useIsManager } from '../../hooks/useFetchCampaign'
import { hasAtLeastNbRewardsConfirmed, hasAtLeastNbRewardsOnChain } from '../../utils/checkHelper'
import { notificationActions } from '../../store/Notification/slice'
import ContributeForm from '../ContributeForm'


const RewardCard = ({ id, renderType }: { id: number, renderType: RENDER_TYPE }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const campaign = useAppSelector((state) => state.campaign)
  const rewards = useAppSelector((state) => state.reward.rewards)
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)
  const isManager: boolean = useIsManager(campaign.manager)


  const handleUpdateReward = () => {
    dispatch(
      rewardActions.setConfirmed({
        id,
        confirmed: false
      })
    )
  }

  const handleDeleteReward = () => {
    if (!campaign.onChain) {
      dispatch(rewardActions.removeReward({ id }))
    } else {
      contractCampaign?.methods.deleteReward(id).send({ from: account }).then(() => {
        dispatch(rewardActions.removeReward({ id }))
        dispatch(notificationActions.setNotification(({
          message: `Reward ${rewards[id].title} has been correctly deleted`,
          type: NOTIFICATION_TYPE.SUCCESS
        })))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  const renderLimitedStockLeft = () => {
    return rewards[id].stockLimit - rewards[id].nbContributors
  }

  const renderRewardButton = () => {
    if (campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted && isManager) {
      if (rewards[id].confirmed) {
        return (
          <div className='list-inline mt-3'>
            <div className='list-inline-item'>
              <button className='btn btn-primary me-3'
                      type='button'
                      onClick={() => handleUpdateReward()}>
                Update Reward
              </button>
            </div>
            {((renderType === RENDER_TYPE.CREATE && hasAtLeastNbRewardsConfirmed(rewards, 2)) || (renderType === RENDER_TYPE.UPDATE && hasAtLeastNbRewardsOnChain(rewards, 2))) &&
            <div className='list-inline-item'>
              <button className='btn btn-danger me-3'
                      type='button'
                      onClick={() => handleDeleteReward()}>
                Delete Reward
              </button>
            </div>
            }
          </div>
        )
      }
      if (renderType === RENDER_TYPE.UPDATE) {
        return (
          <button className='btn btn-primary me-3'
                  type='button'
                  onClick={() => handleUpdateReward()}>
            Add new rewards!
          </button>
        )
      }
    } else if (
      account
      && campaign.proposalAddress ===ZERO_ADDRESS
      &&(
        campaign.workflowStatus === WORKFLOW_STATUS.CampaignPublished
        || (
          campaign.workflowStatus === WORKFLOW_STATUS.FundingComplete
          // && campaign.info.deadlineDate <= new Date().getTime() //Disabled for local test
        )
      )) {
      return (
        <div className='mt-2 mb-2'>
          <ContributeForm id={id} />
        </div>
      )
    }

    return <></>
  }

  return (
    <div className='card'>
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
            htmlFor='nbContributor'
          >
            Number of contributors :
          </label>
          <h6
            className='card-subtitle mb-2 list-inline-item'
            id='nbContributor'
          >
            {rewards[id].nbContributors}
          </h6>
        </div>
        {rewards[id].isStockLimited &&
        <div className='list-inline'>
          <label
            className='form-label list-inline-item'
            htmlFor='rewardStockLimit'
          >
            {`Stock limited (${renderLimitedStockLeft()} left on ${rewards[id].stockLimit})`}
          </label>
        </div>
        }
        {renderRewardButton()}
      </div>
    </div>
  )
}

export default RewardCard
