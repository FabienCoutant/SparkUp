import { useState } from 'react';
import Reward from './Reward';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { reward } from '../../store/reward-slice';
import { rewardActions } from '../../store/reward-slice';
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
      <Link
        to='/createcampaign/confirm'
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <button type='submit' className='btn btn-primary'>
          Next
        </button>
      </Link>
    </div>
  );
};

export default CreateRewards;
