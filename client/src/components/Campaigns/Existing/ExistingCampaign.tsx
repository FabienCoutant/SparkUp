import { Info } from '../../../constants/index';

const ExistingCampaign = (props: { campaignInfo: Info }) => {
  return (
    <div className='card mb-3 mt-3'>
      <div className='card-body'>
        <h1 className='card-title text-center'>{props.campaignInfo.title}</h1>
        <p className='mt-5'>{props.campaignInfo.description}</p>
        <h6>Campaign Ends On {props.campaignInfo.durationDays}</h6>
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

export default ExistingCampaign;
