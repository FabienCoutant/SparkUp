import { useRef } from 'react';

const CreateCampaign = () => {
  const campaignTitleRef = useRef<HTMLInputElement>(null);
  const campaignDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const campaignFundingGoalRef = useRef<HTMLInputElement>(null);
  const campaignDeadlineRef = useRef<HTMLInputElement>(null);

  const campaignSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      null !== campaignTitleRef.current &&
      null !== campaignDescriptionRef.current &&
      null !== campaignFundingGoalRef.current &&
      null !== campaignDeadlineRef.current
    ) {
      console.log(campaignTitleRef.current.value);
      console.log(campaignDescriptionRef.current.value);
      console.log(campaignFundingGoalRef.current.value);
      console.log(campaignDeadlineRef.current.value);
      campaignTitleRef.current.value = '';
      campaignDescriptionRef.current.value = '';
      campaignFundingGoalRef.current.value = '';
      campaignDeadlineRef.current.value = 'jj/mm/aaa';
    }
  };

  return (
    <form onSubmit={campaignSubmitHandler}>
      <div className='mb-3 mt-3'>
        <label htmlFor='campaignTitle' className='form-label'>
          Campaign Title
        </label>
        <input
          type='text'
          className='form-control'
          id='campaignTitle'
          ref={campaignTitleRef}
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
          ref={campaignDescriptionRef}
        ></textarea>
      </div>
      <div className='mb-3 mt-3'>
        <label htmlFor='fundingGoal' className='form-label'>
          Funding Goal (USDC)
        </label>
        <input
          type='number'
          className='form-control'
          id='fundingGoal'
          ref={campaignFundingGoalRef}
        />
      </div>
      <div className='mb-3 mt-3'>
        <label htmlFor='fundingGoal' className='form-label'>
          Deadline
        </label>
        <input
          type='date'
          className='form-control'
          id='fundingGoal'
          ref={campaignDeadlineRef}
        />
      </div>
      <button type='submit' className='btn btn-primary'>
        Create Campaign
      </button>
    </form>
  );
};

export default CreateCampaign;
