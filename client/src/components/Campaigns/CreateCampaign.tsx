import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { campaignActions } from '../../store/campaign-slice';
import { uiActions } from '../../store/ui-slice';
import Campaign from './Campaign';
import NextButton from '../UI/NextButton';
const CreateCampaign = (props?: { showNextButton: boolean }) => {
  const campaignTitleRef = useRef<HTMLInputElement>(null);
  const campaignDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const campaignFundingGoalRef = useRef<HTMLInputElement>(null);
  const campaignDeadlineRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();

  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [fundingGoal, setFundingGoal] = useState(0);
  // const [deadline, setDeadline] = useState<Date | null>(null);
  const confirmed = useAppSelector((state) => state.campaign.confirmed);

  const isValidDate = (date: Date) => {
    if (Object.prototype.toString.call(date) === 'Invalid Date') {
      // it is a date
      return false;
    }
    return true;
  };
  const campaignSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (
      null !== campaignTitleRef.current &&
      null !== campaignDescriptionRef.current &&
      null !== campaignFundingGoalRef.current &&
      null !== campaignDeadlineRef.current
    ) {
      const title = campaignTitleRef.current.value;
      const description = campaignDescriptionRef.current.value;
      const fundingGoal = parseInt(campaignFundingGoalRef.current.value);
      const deadline = new Date(campaignDeadlineRef.current.value);

      if (title === '') {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Please enter a title for your campaign!',
            type: 'alert',
          })
        );
      } else if (description === '') {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Please enter a description for your campaign!',
            type: 'alert',
          })
        );
      } else if (fundingGoal < 10000 || isNaN(fundingGoal)) {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Your funding goal must be at least 10 000 USDC!',
            type: 'alert',
          })
        );
      } else if (!isValidDate(deadline)) {
        console.log(deadline);
        console.log(isValidDate(deadline));
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Please enter a deadline for your campaign!',
            type: 'alert',
          })
        );
      } else {
        dispatch(
          campaignActions.setCampaign({
            title,
            description,
            fundingGoal,
            deadline: new Date(deadline),
            confirmed: true,
          })
        );
        campaignTitleRef.current.value = '';
        campaignDescriptionRef.current.value = '';
        campaignFundingGoalRef.current.value = '';
        campaignDeadlineRef.current.value = 'jj/mm/aaaa';
      }
    }
  };

  const modifyCampaignHandler = () => {
    dispatch(campaignActions.setConfirmed({ confirmed: false }));
  };

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
          <button className='btn btn-primary' onClick={modifyCampaignHandler}>
            Modify Campaign
          </button>
        </div>
      )}
      {props?.showNextButton && (
        <NextButton route='/createcampaign/rewards' disabled={!confirmed} />
      )}
    </>
  );
};

export default CreateCampaign;
