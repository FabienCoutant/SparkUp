import { useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { campaignActions } from '../../../store/campaign-slice';
import { uiActions } from '../../../store/ui-slice';
import { rewardActions } from '../../../store/reward-slice';
import Campaign from './Campaign';
import NextButton from '../../UI/NextButton';
import { isValidDate } from '../../../utils/web3React';
import { useWeb3React } from '@web3-react/core';
import { useLocation } from 'react-router';

const CreateCampaign = (props?: { showNextButton: boolean }) => {
  const { pathname } = useLocation();

  const campaignTitleRef = useRef<HTMLInputElement>(null);
  const campaignDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const campaignFundingGoalRef = useRef<HTMLInputElement>(null);
  const campaignDeadlineRef = useRef<HTMLInputElement>(null);

  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  const confirmed = useAppSelector((state) => state.campaign.confirmed);

  useEffect(() => {
    if (pathname === '/createcampaign') {
      dispatch(
        campaignActions.setCampaign({
          title: null,
          description: null,
          fundingGoal: null,
          deadline: null,
          confirmed: false,
          published: null,
          manager: null,
        })
      );
      dispatch(
        rewardActions.setState({
          newState: {
            id: 0,
            title: null,
            description: null,
            minimumContribution: null,
            amount: 0,
            stockLimit: null,
            nbContributors: 0,
            isStockLimited: null,
            confirmed: false,
          },
        })
      );
    }
  }, [dispatch, pathname]);

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
            message: 'Please enter a title for your campaign!',
            type: 'alert',
          })
        );
      } else if (description === '') {
        dispatch(
          uiActions.setNotification({
            message: 'Please enter a description for your campaign!',
            type: 'alert',
          })
        );
      } else if (fundingGoal < 10000 || isNaN(fundingGoal)) {
        dispatch(
          uiActions.setNotification({
            message: 'Your funding goal must be at least 10 000 USDC!',
            type: 'alert',
          })
        );
      } else if (!isValidDate(deadline)) {
        console.log(deadline);
        console.log(isValidDate(deadline));
        dispatch(
          uiActions.setNotification({
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
            published: false,
            manager: account!,
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
          <Campaign address={null} />
          <button
            className='btn btn-primary mb-3'
            onClick={modifyCampaignHandler}
          >
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
