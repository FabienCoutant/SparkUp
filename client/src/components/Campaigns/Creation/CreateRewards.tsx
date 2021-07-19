import Reward from './Reward';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { reward } from '../../../store/reward-slice';
import { rewardActions } from '../../../store/reward-slice';
import { uiActions } from '../../../store/ui-slice';
import NextButton from '../../UI/NextButton';
const CreateRewards = () => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaign);
  const rewards = useAppSelector((state) => state.reward.rewards);

  useEffect(() => {
    if (!campaign.confirmed) {
      dispatch(
        uiActions.setNotification({
          message: 'You must confirm a campaign to access this page!',
          type: 'error',
        })
      );
    }
  }, []);

  const addRewardHandler = () => {
    dispatch(
      rewardActions.addReward({
        id: rewards.length,
        title: null,
        description: null,
        minimumContribution: null,
        amount: null,
        stockLimit: null,
        isStockLimited: null,
        confirmed: false,
      })
    );
  };

  return (
    <div>
      {campaign.confirmed && (
        <>
          {rewards.map((reward: reward) => {
            return <Reward id={reward.id} key={reward.id} />;
          })}
          <div className='mb-3 mt-3'>
            <button className='btn btn-primary' onClick={addRewardHandler}>
              Add Reward
            </button>
          </div>
          <NextButton route='/createcampaign/confirm' disabled={false} />
        </>
      )}
    </div>
  );
};

export default CreateRewards;
