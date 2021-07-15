import Reward from './Reward';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { reward } from '../../store/reward-slice';
import { rewardActions } from '../../store/reward-slice';
import NextButton from '../UI/NextButton';
const CreateRewards = () => {
  const dispatch = useAppDispatch();
  const rewards = useAppSelector((state) => state.reward.rewards);

  const addRewardHandler = () => {
    dispatch(
      rewardActions.addReward({
        id: rewards.length,
        title: null,
        description: null,
        value: null,
        confirmed: false,
      })
    );
  };

  return (
    <div>
      {rewards.map((reward: reward) => {
        return <Reward id={reward.id} key={reward.id} />;
      })}
      <div className='mb-3 mt-3'>
        <button className='btn btn-primary' onClick={addRewardHandler}>
          Add Reward
        </button>
      </div>
      <NextButton route='/createcampaign/confirm' disabled={false} />
    </div>
  );
};

export default CreateRewards;
