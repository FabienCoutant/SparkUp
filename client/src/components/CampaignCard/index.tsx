import { CampaignInfo, RENDER_TYPE } from '../../constants'
import { Link } from 'react-router-dom'
import { useFetchCampaignInfo, useIsManager } from '../../hooks/useFetchCampaign'
import { campaignActions } from '../../store/Campaign/slice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'


const CampaignCard = ({ address  }: { address: string }) => {
  const dispatch=useAppDispatch();
  const isManager = useIsManager()

  const campaign = useFetchCampaignInfo(address);

  const modifyCampaignHandler = () => {
    dispatch(campaignActions.setConfirmed({ confirmed: false }))
  }

  return (
    <div className='card mb-3 mt-3'>
      <div className="card-header text-center">
        {campaign.info.title}
      </div>
      <div className='card-body'>
        <p className='card-text mt-5' id='campaignDescription'>
          {campaign.info.description}
        </p>
        <h6 className='card-subtitle mb-2' id='campaignFundingGoal'>
          Funding Goal :{' '}
          {campaign.info.fundingGoal} USDC
        </h6>
        <h6
          className='card-subtitle mb-2 list-inline-item'
          id='campaignDeadline'
        >
          Campaign Ends On :{' '}
          {campaign.info.deadlineDate && new Date(campaign.info.deadlineDate).toLocaleDateString()
          }
        </h6>
        <div className='mt-3'>
          {campaign.info && renderType == RENDER_TYPE.LIST && (
            <Link
              to={`/campaign/${address}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <button type='button' className='btn btn-primary gap-2'>
                More
              </button>
            </Link>
          )}
          {campaign.info && address && renderType === RENDER_TYPE.DETAIL && (
            <div className='progress mt-5 mb-5'>
              <div
                className='progress-bar progress-bar-striped progress-bar-animated'
                role='progressbar'
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: '75%' }}
              />
            </div>
          )}
          {isManager && campaign.info && address && renderType === RENDER_TYPE.DETAIL &&(
            <Link to={`/campaign/${address}/update`}>
              <button type='button' className='btn btn-primary'>
                Update Campaign
              </button>
            </Link>
          )}
          {campaign.info && renderType === RENDER_TYPE.UPDATE &&(
              <button type='button' className='btn btn-primary' onClick={modifyCampaignHandler}>
                Correct Campaign's info
              </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CampaignCard
