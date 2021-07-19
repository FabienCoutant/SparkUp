import { useAppSelector } from '../../../store/hooks';
import { Info } from '../../../constants/index';
import { Link } from 'react-router-dom';

const Campaign = (props: { campaign: Info | null; address: string | null }) => {
  const campaign = useAppSelector((state) => state.campaign);

  return (
    <div className='card mb-3 mt-3'>
      <div className='card-body'>
        <div className='list-inline'>
          <label
            htmlFor='campaignTitle'
            className='form-label list-inline-item'
          >
            Campaign Title :
          </label>
          <h5 className='card-title list-inline-item' id='campaignTitle'>
            {props.campaign ? props?.campaign.title : campaign.title}
          </h5>
        </div>
        <label htmlFor='campaignDescription' className='form-label'>
          Campaign Description :
        </label>
        <p className='card-text' id='campaingDescription'>
          {props.campaign ? props?.campaign.description : campaign.description}
        </p>
        <div className='list-inline'>
          <label
            htmlFor='campaignFundingGoal'
            className='form-label list-inline-item'
          >
            Campaign Funding Goal :
          </label>
          <h6
            className='card-subtitle mb-2 list-inline-item'
            id='campaignFundingGoal'
          >
            {props.campaign
              ? props?.campaign.fundingGoal
              : campaign.fundingGoal}
          </h6>
        </div>
        <div className='list-inline'>
          <label
            htmlFor='campaignDeadline'
            className='form-label list-inline-item'
          >
            Campaign Deadline :
          </label>
          <h6
            className='card-subtitle mb-2 list-inline-item'
            id='campaignDeadline'
          >
            {props.campaign
              ? props?.campaign.durationDays
              : campaign.deadline?.toDateString()}
          </h6>
        </div>
        {props.campaign && (
          <Link
            to={`/campaign-details/:${props.address}`}
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <button type='button' className='btn btn-primary gap-2'>
              More
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Campaign;
