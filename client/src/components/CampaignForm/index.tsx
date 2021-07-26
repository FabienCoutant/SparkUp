import { notificationActions } from '../../store/Notification/slice'
import { CampaignInfo, Info, NOTIFICATION_TYPE, RENDER_MESSAGE, RENDER_TYPE } from '../../constants'
import { formatDate, isValidDate, serializeTimestampsFor } from '../../utils/dateHelper'
import { campaignActions } from '../../store/Campaign/slice'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useContractCampaign } from '../../hooks/useContract'
import { useParams } from 'react-router'

const CampaignForm = ({ renderType, campaignInfo }: { renderType: RENDER_TYPE, campaignInfo: CampaignInfo }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)

  const [campaignTitle, setCampaignTitle] = useState(campaignInfo.info.title)
  const [campaignDescription, setCampaignDescription] = useState(campaignInfo.info.description)
  const [campaignFundingGoal, setCampaignFundingGoal] = useState(campaignInfo.info.fundingGoal)
  const [campaignDeadLine, setCampaignDeadLine] = useState(campaignInfo.info.deadlineDate)

  useEffect(() => {
    if (contractCampaign !== null) {
      contractCampaign.events.CampaignInfoUpdated().on('data', async () => {
        console.log("TODO Redirect with notif");
      })
    }
  }, [contractCampaign])


  const campaignSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const isValid = campaignValidationHandler()
    if (isValid) {
      switch (renderType) {
        case RENDER_TYPE.UPDATE:
          await submitUpdatedCampaign()
          break
        case RENDER_TYPE.CREATE:
          await confirmInfoCampaign()
          break
      }
    }
  }
  const confirmInfoCampaign = async () => {
    dispatch(
      campaignActions.setCampaign({
        info: {
          title: campaignTitle,
          description: campaignDescription,
          fundingGoal: campaignFundingGoal,
          deadlineDate: campaignDeadLine
        },
        confirmed: true,
        published: false,
        manager: account as string,
        createAt: new Date().getTime()
      })
    )

  }

  const submitUpdatedCampaign = async () => {
    const campaignInfo: Info = {
      title: campaignTitle,
      description: campaignDescription,
      fundingGoal: campaignFundingGoal,
      deadlineDate: serializeTimestampsFor(campaignDeadLine, true)
    }
    if (contractCampaign) {
      try {
        await contractCampaign.methods
          .updateCampaign(campaignInfo)
          .send({ from: account })
      } catch (error) {
        throw error
      }
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
      } else if (!isValidDate(deadline, campaignInfo.createAt)) {
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
    <form onSubmit={campaignSubmitHandler} className='card'>
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
        <button type='submit' className='btn btn-primary'>
          {RENDER_MESSAGE[renderType]}
        </button>
      </div>
    </form>
  )
}

export default CampaignForm
