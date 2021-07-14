import { useRef, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { campaignActions } from '../../store/campaign-slice';
import { Link } from 'react-router-dom';
import Campaign from './Campaign';
const CreateCampaign = () => {
  const campaignTitleRef = useRef<HTMLInputElement>(null);
  const campaignDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const campaignFundingGoalRef = useRef<HTMLInputElement>(null);
  const campaignDeadlineRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fundingGoal, setFundingGoal] = useState(0);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const confirmed = useAppSelector((state) => state.campaign.confirmed);
  const campaignSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      null !== campaignTitleRef.current &&
      null !== campaignDescriptionRef.current &&
      null !== campaignFundingGoalRef.current &&
      null !== campaignDeadlineRef.current
    ) {
      setTitle(campaignTitleRef.current.value);
      setDescription(campaignDescriptionRef.current.value);
      setFundingGoal(parseInt(campaignFundingGoalRef.current.value));
      setDeadline(new Date(campaignDeadlineRef.current.value));
      dispatch(campaignActions.setConfirmed({ confirmed: true }));

      campaignTitleRef.current.value = '';
      campaignDescriptionRef.current.value = '';
      campaignFundingGoalRef.current.value = '';
      campaignDeadlineRef.current.value = 'jj/mm/aaa';
    }
  };

  const modifyCampaignHandler = () => {
    dispatch(campaignActions.setConfirmed({ confirmed: false }));
  };

  useEffect(() => {
    if (
      title !== '' &&
      description !== '' &&
      fundingGoal !== 0 &&
      deadline !== null
    ) {
      dispatch(
        campaignActions.setCampaign({
          title,
          description,
          fundingGoal,
          deadline,
          confirmed,
        })
      );
    }
  }, [dispatch, title, description, fundingGoal, deadline, confirmed]);

  return (
    <>
      {!confirmed && (
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
            Confirm Campaign
          </button>
        </form>
      )}
      {confirmed && (
        <div className='mt-3'>
          <Campaign />
          <button
            className='btn btn-primary mt-3'
            onClick={modifyCampaignHandler}
          >
            Modify Campaign
          </button>
        </div>
      )}
      <Link
        to='/createcampaign/rewards'
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <button
          type='submit'
          className='btn btn-primary mt-3'
          disabled={!confirmed}
        >
          Next
        </button>
      </Link>
    </>
  );
};

export default CreateCampaign;
