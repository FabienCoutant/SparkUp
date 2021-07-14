import { useAppSelector } from '../../store/hooks';

const Campaign = () => {
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
            {campaign.title}
          </h5>
        </div>
        <label htmlFor='campaignDescription' className='form-label'>
          Campaign Description :
        </label>
        <p className='card-text' id='campaingDescription'>
          {campaign.description}
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
            {campaign.fundingGoal}
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
            {campaign.deadline?.toDateString()}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
