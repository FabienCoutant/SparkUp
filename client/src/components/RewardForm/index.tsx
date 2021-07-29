import { notificationActions } from '../../store/Notification/slice'
import { NOTIFICATION_TYPE, RENDER_MESSAGE, RENDER_TYPE, Rewards } from '../../constants'
import { reward, rewardActions } from '../../store/Reward/slice'
import { useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useParams } from 'react-router'
import { useContractCampaign } from '../../hooks/useContract'
import { serializeValueTo } from '../../utils/serializeValue'


const RewardForm = ({ id, reward, renderType }: { id: number, reward: reward, renderType: RENDER_TYPE }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)
  const [rewardTitle, setRewardTitle] = useState(reward.title)
  const [rewardDescription, setRewardDescription] = useState(reward.description)
  const [rewardMinimumContribution, setRewardMinimumContribution] = useState(reward.minimumContribution)
  const [rewardStockLimit, setRewardStockLimit] = useState(reward.stockLimit)
  const [rewardIsStockLimited, setRewardIsStockLimited] = useState(reward.isStockLimited)

  const stockLimitedClickHandler = (stockIsLimited: boolean) => {
    setRewardIsStockLimited(stockIsLimited)
  }

  const rewardSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = rewardValidationHandler()
    if (isValid) {
      switch (renderType) {
        case RENDER_TYPE.UPDATE:
          updatedOnChainReward()
          break
        case RENDER_TYPE.CREATE:
          validateReward()
          break
        case RENDER_TYPE.ADD:
          addReward()
          break
      }
    }
  }

  const handleCancelNew = () => {
    dispatch(rewardActions.removeReward({ id: id }))
  }

  const handleCancelUpdate = () => {
    dispatch(
      rewardActions.setConfirmed({
        id,
        confirmed: true
      }))
  }

  const handleCancel = () => {
    switch (renderType) {
      case RENDER_TYPE.ADD:
      case RENDER_TYPE.CREATE:
        handleCancelNew()
        break
      case RENDER_TYPE.UPDATE:
        handleCancelUpdate()
    }
  }

  const rewardValidationHandler = () => {
    if (account) {
      if (rewardIsStockLimited === null) {
        dispatch(
          notificationActions.setNotification({
            message:
              'Please indicate if there is an inventory limit for this reward!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else {
        const title = rewardTitle
        const description = rewardDescription
        const minimumContribution = rewardMinimumContribution
        let stockLimit
        if (!rewardIsStockLimited) {
          stockLimit = 0
        } else {
          stockLimit = rewardStockLimit
        }
        if (title === '') {
          dispatch(
            notificationActions.setNotification({
              message: 'Please enter a title for your reward!',
              type: NOTIFICATION_TYPE.ALERT
            })
          )
        } else if (description === '') {
          dispatch(
            notificationActions.setNotification({
              message: 'Please enter a description for your reward!',
              type: NOTIFICATION_TYPE.ALERT
            })
          )
        } else if (minimumContribution < 5) {
          dispatch(
            notificationActions.setNotification({
              message: 'Please enter a minimumContribution higher than 5!',
              type: NOTIFICATION_TYPE.ALERT
            })
          )
        } else if (rewardIsStockLimited && (stockLimit === 0 || stockLimit === undefined)) {
          dispatch(
            notificationActions.setNotification({
              message: 'Please enter an inventory reward greater than 0!',
              type: NOTIFICATION_TYPE.ALERT
            })
          )
        } else {
          return true
        }
        return false
      }
      return false
    }
  }

  const validateReward = () => {
    dispatch(
      rewardActions.updateReward({
        reward: {
          title: rewardTitle,
          description: rewardDescription,
          minimumContribution: rewardMinimumContribution,
          amount: 0,
          nbContributors: 0,
          stockLimit: rewardStockLimit,
          isStockLimited: rewardIsStockLimited,
          onChain: false,
          confirmed: true
        },
        id: id
      })
    )
  }

  const updatedOnChainReward = () => {
    const reward: Rewards = {
      title: rewardTitle,
      description: rewardDescription,
      minimumContribution: serializeValueTo(rewardMinimumContribution,true),
      amount: 0,
      stockLimit: rewardStockLimit,
      nbContributors: 0,
      isStockLimited: rewardIsStockLimited
    }
    if (contractCampaign) {
      contractCampaign?.methods?.updateReward(reward, id).send({ from: account }).then(() => {
        const rewardState:reward = {
          ...reward,
          onChain: true,
          confirmed: true
        }
        dispatch(rewardActions.updateReward({ reward: { ...rewardState, minimumContribution:rewardMinimumContribution },id }))
        dispatch(notificationActions.setNotification(({
          message: `Reward ${rewardTitle} has been correctly updated`,
          type:NOTIFICATION_TYPE.SUCCESS
        })))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  const addReward = () => {
    const reward: Rewards = {
      title: rewardTitle,
      description: rewardDescription,
      minimumContribution: serializeValueTo(rewardMinimumContribution,true),
      amount: 0,
      stockLimit: rewardStockLimit,
      nbContributors: 0,
      isStockLimited: rewardIsStockLimited
    }
    if (contractCampaign) {
      contractCampaign?.methods?.addReward(reward).send({ from: account }).then(() => {
        const rewardState:reward = {
          ...reward,
          onChain: true,
          confirmed:true
        }

        dispatch(rewardActions.updateReward({ reward:{
          ...rewardState, minimumContribution:rewardMinimumContribution
          },id }))
        dispatch(notificationActions.setNotification(({
          message: `Reward ${rewardTitle} has been correctly added`,
          type:NOTIFICATION_TYPE.SUCCESS
        })))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  return (
    <form onSubmit={rewardSubmitHandler}>
      <div className='card-body'>
        <h5 className='card-title'>Reward {id + 1}</h5>
        <div className='mb-3 mt-3'>
          <label htmlFor='rewardTitle' className='form-label'>
            Reward Title
          </label>
          <input
            type='text'
            className='form-control'
            id='rewardTitle'
            value={rewardTitle}
            onChange={(e) => setRewardTitle(e.target.value)}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='rewardDescription'>
            Describe your reward
          </label>
          <textarea
            className='form-control'
            placeholder='Describe your campaign here'
            id='rewardDescription'
            style={{ height: '100px' }}
            value={rewardDescription}
            onChange={(e) => setRewardDescription(e.target.value)}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='rewardMinimumContribution' className='form-label'>
            Minimum Contribution (USDC)
          </label>
          <input
            type='number'
            className='form-control'
            id='rewardMinimumContribution'
            value={rewardMinimumContribution}
            onChange={(e) => setRewardMinimumContribution(parseInt(e.target.value))}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='isStockLimited' className='form-label'>
            Is there an inventory limit for this reward ?
          </label>
          <div id='isStockLimited'>
            <button
              type='button'
              className='btn btn-primary me-3'
              onClick={() => stockLimitedClickHandler(true)}
            >
              Yes
            </button>
            <button
              type='button'
              className='btn btn-primary'
              onClick={() => stockLimitedClickHandler(false)}
            >
              No
            </button>
          </div>
        </div>
        {rewardIsStockLimited && (
          <div className='mb-3 mt-3'>
            <label htmlFor='rewardStockLimit' className='form-label'>
              Stock Limit
            </label>
            <input
              type='number'
              className='form-control'
              id='rewardStockLimit'
              value={rewardStockLimit}
              onChange={(e) => setRewardStockLimit(parseInt(e.target.value))}
            />
          </div>
        )}
        <div className='list-inline'>
          <div className='list-inline-item'>
            <button type='submit' className='btn btn-primary'>
              {renderType === RENDER_TYPE.CREATE && RENDER_MESSAGE[renderType]}
              {renderType === RENDER_TYPE.ADD && RENDER_MESSAGE[renderType]}
              {renderType === RENDER_TYPE.UPDATE && RENDER_MESSAGE[renderType]}
            </button>
          </div>

          {!(renderType === RENDER_TYPE.CREATE && id === 0) &&
          <div className='list-inline-item'>
            <button type='button' className='btn btn-secondary' onClick={() => handleCancel()}>Cancel</button>
          </div>
          }
        </div>
      </div>
    </form>
  )
}

export default RewardForm
