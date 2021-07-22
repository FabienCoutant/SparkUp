import { Info } from '../../../constants';
import { Link } from 'react-router-dom';

const CampaignSummary = (props: { campaignInfo: Info; address: string }) => {
  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>{props.campaignInfo.title}</h5>
        <p className='card-text'>{props.campaignInfo.description}</p>
        <Link
          to={`/campaign-details/:${props.address}`}
          style={{ textDecoration: 'none', color: 'white' }}
        >
          <button type='button' className='btn btn-primary gap-2 mt-3'>
            More
          </button>
        </Link>
        <div className='progress mt-5 mb-5'>
          <div
            className='progress-bar progress-bar-striped progress-bar-animated'
            role='progressbar'
            aria-valuenow={75}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{ width: '75%' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSummary;
