import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { campaignActions } from '../../store/Campaign/slice'
import { reward, rewardActions } from '../../store/Reward/slice'
import { Info, NOTIFICATION_TYPE, RENDER_TYPE, Rewards } from '../../constants'
import CampaignForm from '../../components/CampaignForm'
import CampaignCard from '../../components/CampaignCard'
import RewardCard from '../../components/RewardCard'
import { useWeb3React } from '@web3-react/core'
import { useContractCampaignCreator } from '../../hooks/useContract'
import { notificationActions } from '../../store/Notification/slice'
import { serializeTimestampsFor } from '../../utils/dateHelper'
import { useHistory } from 'react-router'
import RewardForm from '../../components/RewardForm'
import Loader from '../../components/Loader'
import { useShowLoader } from '../../hooks/useShowLoader'
import { serializeUSDCFor } from '../../utils/serializeValue'

const CreateCampaign = () => {
  const { chainId, account } = useWeb3React()
  const history = useHistory()
  const dispatch = useAppDispatch()
  const contractProxyFactory = useContractCampaignCreator()
  const campaign = useAppSelector((state) => state.campaign)
  const rewards = useAppSelector((state) => state.reward.rewards)
  const [isInit, setIsInit] = useState<boolean>(false)

  const showLoader = useShowLoader()


  if (!isInit && account) {
    dispatch(campaignActions.resetState())
    dispatch(rewardActions.resetState())
    setIsInit(true)
  }

  const submitCampaignHandler = () => {
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
          fundingGoal: serializeUSDCFor(campaign.info.fundingGoal,true),
          deadlineDate: serializeTimestampsFor(campaign.info.deadlineDate, true)
        }
        const rewardsInfo: Rewards[] = []
        rewards.map((reward) => {
          const tempReward: Rewards = {
            title: reward.title,
            description: reward.description,
            minimumContribution: serializeUSDCFor(reward.minimumContribution,true),
            amount: 0,
            stockLimit: reward.stockLimit,
            nbContributors: 0,
            isStockLimited: reward.isStockLimited
          }
          rewardsInfo.push(tempReward)
          return rewardsInfo
        })
        contractProxyFactory?.methods?.createCampaign(campaignInfo, rewardsInfo).send({ from: account })
          .then((response: any) => {
            const newCampaignAddress = response.events.newCampaign.returnValues.campaignAddress
            history.push({ pathname: `/campaign/${newCampaignAddress}` })
          }).catch((error: any) => {
            console.log(error)
        })
      }
    }
  }

  const addNewReward = () => {
    dispatch(
      rewardActions.addReward(
        {
          reward: {
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
    if (campaign.confirmed) {
      return <CampaignCard address={''} />
    } else {
      return <CampaignForm renderType={RENDER_TYPE.CREATE} />
    }
  }

  const renderReward = (reward: reward, index: number) => {
    if (reward.confirmed) {
      return <RewardCard id={index} renderType={RENDER_TYPE.CREATE} />
    } else {
      return <RewardForm id={index} reward={reward} renderType={RENDER_TYPE.CREATE} />
    }
  }

  if (showLoader) {
    return <Loader />
  }

  if (typeof account !== 'string' || account === '') {
    history.push({ pathname: '/' })
  }
  return (
    <div id='create-campaign'>
      <h1 className='mt-5 mb-5 text-center'>Create a new Campaign</h1>
      <div className='mb-5'>
        {renderCampaign()}
      </div>
      {rewards.map((reward, index) => {
        return (
          <div className='card mb-3' key={index}>
            {renderReward(reward, index)}
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
