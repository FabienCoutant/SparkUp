import { WORKFLOW_STATUS } from '../../constants'
import { Link } from 'react-router-dom'
import { useFetchCampaignInfo, useIsManager } from '../../hooks/useFetchCampaign'
import { campaignActions } from '../../store/Campaign/slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { getEndDateIn } from '../../utils/dateHelper'


const CampaignCard = ({ address }: { address: string }) => {
  const dispatch = useAppDispatch()
  const campaignInfo = useFetchCampaignInfo(address)
  let campaign = useAppSelector(state => state.campaign)
  if (address !== '') {
    campaign = campaignInfo
  }
  const isManager = useIsManager(campaign.manager)

  const modifyCampaignHandler = () => {
    dispatch(campaignActions.setConfirmed({ confirmed: !campaign.confirmed }))
  }

  const renderCampaignProgressGoal = () => {
    return (campaign.amountRaise / campaign.info.fundingGoal) * 100
  }

  const renderManagerAction = () => {
    if (address !== '') {
      return (<Link
          to={`/campaign/${address}`}
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <button type='button' className='btn btn-primary gap-2'>
            More details
          </button>
        </Link>
      )
    }
    if (campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted && isManager) {
      if (campaign.confirmed) {
        return (
          <button type='button' className='btn btn-primary' onClick={modifyCampaignHandler}>
            Update
          </button>
        )

      }
    }
    return
  }

  if (address !== '' && campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted && !isManager) {
    return <></>
  }

  return (
    <div className='col'>
      <div className='card mb-3 mt-3 '>
        <div className='card-header text-center bg-secondary fw-bold'>
          Title : {campaign.info.title}<br />
          {campaign.workflowStatus === WORKFLOW_STATUS.CampaignPublished && `Publish : You can contribute`}
          {campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted && `Draft : Only you can see it`}
          {campaign.workflowStatus === WORKFLOW_STATUS.FundingComplete && `Funding succeeded : You can participate to the proposal vote`}
          {campaign.workflowStatus === WORKFLOW_STATUS.FundingFailed && `Funding failed : You can ask for refund if you are a contributor`}
        </div>
        <div className='card-body'>
          <h6
            className='card-subtitle mb-2'
            id='manager'
          >
            Campaign create by :{' '}
            {campaign.manager}
          </h6>
          <h6
            className='card-subtitle mb-2'
            id='campaignDeadline'
          >
            Campaign Ends On :{' '}
            {campaign.info.deadlineDate && `${new Date(campaign.info.deadlineDate).toLocaleDateString()} (${getEndDateIn(campaign.info.deadlineDate)} days left)`
            }
          </h6>
          <h6
            className='card-subtitle mb-2'
            id='campaignCreationDate'
          >
            Campaign create on :{' '}
            {campaign.createAt && new Date(campaign.createAt).toLocaleDateString()}

          </h6>
          <p className='card-text fw-bold' id='campaignDescription'>
            Description :{' '}
            {campaign.info.description}
          </p>
          <p className='card-text mb-3' id='campaignFundingGoal'>
            Funding Goal :{' '}
            {campaign.info.fundingGoal} USDC
          </p>
          <p className='card-text mb-3' id='campaignAmountRaised'>
            Amount raised : {campaign.amountRaise} USDC{' '}
            <span className='progress'>
            <span
              className='progress-bar progress-bar-striped progress-bar-animated'
              role='progressbar'
              aria-valuenow={renderCampaignProgressGoal()}
              aria-valuemin={0}
              aria-valuemax={100}
              style={{ width: `${renderCampaignProgressGoal().toFixed(2)}%` }}
            >{renderCampaignProgressGoal().toFixed(2)} %
            </span>
          </span>
          </p>
          <div className='mt-3'>
            {renderManagerAction()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignCard
