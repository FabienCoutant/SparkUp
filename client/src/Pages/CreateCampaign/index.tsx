import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { campaignActions } from '../../store/Campaign/slice'
import { Info, NOTIFICATION_TYPE, RENDER_TYPE, Rewards } from '../../constants'
import { rewardActions } from '../../store/Reward/slice'
import CampaignForm from '../../components/CampaignForm'
import CampaignCard from '../../components/CampaignCard'
import RewardCard from '../../components/RewardCard'
import { useWeb3React } from '@web3-react/core'
import { useContractCampaignFactory } from '../../hooks/useContract'
import { notificationActions } from '../../store/Notification/slice'
import { serializeTimestampsFor } from '../../utils/dateHelper'

const CreateCampaign = () => {
  const { chainId, account } = useWeb3React()
  const dispatch = useAppDispatch()
  const contractCampaignFactory = useContractCampaignFactory()
  const campaign = useAppSelector((state) => state.campaign)
  const rewards = useAppSelector((state) => state.reward.rewards)
  const [isInit, setIsInit] = useState<boolean>(false)

  useEffect(() => {
    if (!isInit) {
      dispatch(
        campaignActions.setCampaign({
          info: {
            title: '',
            description: '',
            fundingGoal: 10000,
            deadlineDate: new Date().setDate(new Date().getDate() + 7)
          },
          confirmed: false,
          published: false,
          manager: '',
          createAt: 0
        })
      )
      dispatch(
        rewardActions.setState({
          newState: {
            id: 0,
            title: '',
            description: '',
            minimumContribution: 0,
            amount: 0,
            stockLimit: 0,
            nbContributors: 0,
            isStockLimited: false,
            confirmed: false,
            published: false
          }
        })
      )
      setIsInit(true)
    }
  }, [dispatch])

  const submitCampaignHandler = async () => {
    if (chainId) {
      if (!campaign.confirmed || rewards.some(reward => !reward.confirmed)) {
        dispatch(
          notificationActions.setNotification({
            message: 'You must validate your campaign and reward before submit!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else {
        dispatch(notificationActions.hideNotification())
        const campaignInfo: Info = {
          title: campaign.info.title,
          description: campaign.info.description,
          fundingGoal: campaign.info.fundingGoal,
          deadlineDate: serializeTimestampsFor(campaign.info.deadlineDate, true)
        }
        const rewardsInfo: Rewards[] = []
        rewards.map((reward) => {
          const tempReward: Rewards = {
            title: reward.title,
            description: reward.description,
            minimumContribution: reward.minimumContribution,
            amount: 0,
            stockLimit: reward.stockLimit,
            nbContributors: 0,
            isStockLimited: reward.isStockLimited
          }
          rewardsInfo.push(tempReward)
          return rewardsInfo
        })
        try {
          await contractCampaignFactory?.methods
            .createCampaign(campaignInfo, rewardsInfo)
            .send({ from: account })
        } catch (error) {
          console.log(error)
        }
      }
    }
  }

  const addNewReward = () => {
    dispatch(
      rewardActions.addReward({
        id: rewards.length,
        title: '',
        description: '',
        minimumContribution: 0,
        amount: 0,
        stockLimit: 0,
        nbContributors: 0,
        isStockLimited: false,
        confirmed: false,
        published: false
      })
    )
  }

  const renderCreateButton = () => {
    if (campaign.confirmed && rewards.every(reward => reward.confirmed)) {
      return (<button
        className='btn btn-primary mb-3'
        type='button'
        onClick={submitCampaignHandler}
      >
        Create my Campaign
      </button>)
    } else {
      return (
        <button
          className='btn btn-primary mb-3'
          type='button'
          disabled
        >
          Your must validate the campaign info and rewards
        </button>)
    }
  }

  const renderCampaign = () => {
    if (!campaign.confirmed) {
      return <CampaignForm renderType={RENDER_TYPE.CREATE} campaignInfo={campaign} />
    } else {
      return <CampaignCard address={''} renderType={RENDER_TYPE.UPDATE} campaignInfo={campaign} />
    }
  }

  return (
    <div id='create-campaign'>
      <h1 className='mt-5 mb-5 text-center'>Create a new Campaign</h1>
      <div className='mb-5'>
        {renderCampaign()}
      </div>
      {rewards.map((reward) => {
        return (
          <div className='mb-3' key={reward.id}>
            <RewardCard id={reward.id} />
          </div>
        )
      })}
      <div className='mb-3 mt-3'>
        <button className='btn btn-primary' onClick={addNewReward}>
          Add Reward
        </button>
      </div>
      <div className='text-center'>
        {renderCreateButton()}
      </div>
    </div>


  )
}

export default CreateCampaign
