import { notificationActions } from '../../store/Notification/slice'
import { Info, NOTIFICATION_TYPE, RENDER_MESSAGE, RENDER_TYPE, WORKFLOW_STATUS } from '../../constants'
import { formatDate, isValidDate, serializeTimestampsFor } from '../../utils/dateHelper'
import { campaignActions } from '../../store/Campaign/slice'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useContractCampaign } from '../../hooks/useContract'
import { useParams } from 'react-router'

const CampaignForm = ({ renderType }: { renderType: RENDER_TYPE }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)
  const campaign = useAppSelector(state=>state.campaign)
  const [campaignTitle, setCampaignTitle] = useState(campaign.info.title)
  const [campaignDescription, setCampaignDescription] = useState(campaign.info.description)
  const [campaignFundingGoal, setCampaignFundingGoal] = useState(campaign.info.fundingGoal)
  const [campaignDeadLine, setCampaignDeadLine] = useState(campaign.info.deadlineDate)

  const campaignSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = campaignValidationHandler()
    if (isValid) {
      switch (renderType) {
        case RENDER_TYPE.UPDATE:
          updatedOnChainCampaign()
          break
        case RENDER_TYPE.CREATE:
          validateCampaignInfo()
          break
      }
    }
  }
  const validateCampaignInfo = () => {
    dispatch(
      campaignActions.setCampaign({
        info: {
          title: campaignTitle,
          description: campaignDescription,
          fundingGoal: campaignFundingGoal,
          deadlineDate: campaignDeadLine
        },
        confirmed: true,
        onChain: false,
        amountRaise:0,
        manager: account as string,
        createAt: new Date().getTime(),
        workflowStatus:WORKFLOW_STATUS.CampaignDrafted
      })
    )

  }

  const handleCancelUpdate = () => {
    dispatch(
      campaignActions.setConfirmed({
        confirmed: true
      }))
  }

  const updatedOnChainCampaign = () => {
    const campaignInfo: Info = {
      title: campaignTitle,
      description: campaignDescription,
      fundingGoal: campaignFundingGoal,
      deadlineDate: serializeTimestampsFor(campaignDeadLine, true)
    }
    console.log("update")
    if (contractCampaign) {
        contractCampaign?.methods?.updateCampaign(campaignInfo).send({ from: account })
          .then(() => {
            dispatch(campaignActions.updateCampaign({campaignInfo}))
            dispatch(notificationActions.setNotification({
              message:"Your campaign's info has been updated",
              type:NOTIFICATION_TYPE.SUCCESS
            }))
          }).catch((error: any) => {
          console.log(error)
        })
    }
  }

  const campaignValidationHandler = () => {
    if (account) {
      const title = campaignTitle
      const description = campaignDescription
      const fundingGoal = campaignFundingGoal
      const deadline = campaignDeadLine

      if (title === '') {
        dispatch(
          notificationActions.setNotification({
            message: 'Please enter a title for your campaign!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else if (description === '') {
        dispatch(
          notificationActions.setNotification({
            message: 'Please enter a description for your campaign!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else if (fundingGoal === undefined || fundingGoal < 10000) {
        dispatch(
          notificationActions.setNotification({
            message: 'Your funding goal must be at least 10 000 USDC!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else if (!isValidDate(deadline, campaign.createAt)) {
        dispatch(
          notificationActions.setNotification({
            message: 'Please enter a deadline for your campaign more than 7 days from now!',
            type: NOTIFICATION_TYPE.ALERT
          })
        )
      } else {
        return true
      }
    }
    return false
  }


  return (
    <form onSubmit={campaignSubmitHandler} className='card mt-3'>
      <div className='card-body'>
        <h5 className='card-title'>Campaign Info</h5>
        <div className='mb-3 mt-3'>
          <label htmlFor='campaignTitle' className='form-label'>
            Campaign Title
          </label>
          <input
            type='text'
            className='form-control'
            id='campaignTitle'
            value={campaignTitle}
            onChange={(e) => setCampaignTitle(e.target.value)}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='campaignDescription'>
            Comments
          </label>
          <textarea
            className='form-control'
            placeholder='Describe your campaign here'
            id='campaignDescription'
            style={{ height: '100px' }}
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='fundingGoal' className='form-label'>
            Funding Goal (USDC)
          </label>
          <input
            type='number'
            className='form-control'
            id='fundingGoal'
            value={campaignFundingGoal}
            onChange={(e) => setCampaignFundingGoal(parseInt(e.target.value))}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='fundingGoal' className='form-label'>
            Deadline
          </label>
          <input
            type='date'
            className='form-control'
            id='deadLine'
            value={formatDate(campaignDeadLine)}
            onChange={(e) => setCampaignDeadLine(new Date(e.target.value).getTime())}
          />
        </div>
        <div className='list-inline'>
          <div className="list-inline-item">
            <button type='submit' className='btn btn-primary'>
              {renderType === RENDER_TYPE.CREATE && RENDER_MESSAGE[renderType]}
              {renderType === RENDER_TYPE.UPDATE && RENDER_MESSAGE[renderType]}
            </button>
          </div>

          {renderType === RENDER_TYPE.UPDATE  &&
          <div className="list-inline-item">
            <button type='button' className='btn btn-secondary' onClick={() => handleCancelUpdate()}>Cancel</button>
          </div>
          }
        </div>
      </div>
    </form>
  )
}

export default CampaignForm
