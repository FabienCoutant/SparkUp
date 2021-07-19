import { Rewards } from '../../../constants/index';
import { useState } from 'react';

const ExistingReward = (props: { reward: Rewards; isManager: boolean }) => {
  const [showContribute, setShowContribute] = useState(false);
  const [modifyReward, setModifyReward] = useState(false);

  const contributeClickHandler = () => {
    setShowContribute(true);
  };

  const modifyRewardClickHandler = () => {
    setModifyReward(true);
  };

  return (
    <div className='card-body'>
      <h3 className='card-title'>{props.reward.title}</h3>
      <p className='mt-3'>{props.reward.description}</p>
      <div className='mb-2 mt-3 list-inline'>
        <label
          className='form-label list-inline-item'
          htmlFor='rewardMinimumContribution'
        >
          Minimum Contribution (USDC) :
        </label>
        <h6
          className='card-subtitle list-inline-item'
          id='rewardMiniumContribution'
        >
          {props.reward.minimumContribution} USDC
        </h6>
      </div>
      {props.reward.isStockLimited && (
        <div className='mb-2 list-inline'>
          <label
            className='form-label list-inline-item'
            htmlFor='rewardInventory'
          >
            Inventory :
          </label>
          <h6
            className='card-subtitle mb-2 list-inline-item'
            id='rewardInventory'
          >
            {props.reward.stockLimit}
          </h6>
        </div>
      )}
      <div className='mb-2 list-inline'>
        <label
          className='form-label list-inline-item'
          htmlFor='rewardContributors'
        >
          Contributors :
        </label>
        <h6
          className='card-subtitle mb-2 list-inline-item'
          id='rewardContributors'
        >
          {props.reward.nbContributors}
        </h6>
      </div>
      {!props.isManager && (
        <div className='mb-2 list-inline'>
          <button
            className='btn btn-primary form-label me-3'
            onClick={contributeClickHandler}
          >
            Contribute
          </button>
          {showContribute && (
            <>
              <input
                type='number'
                className='card-subtitle mb-2 me-3 form-input'
                id='rewardContribution'
              />
              <label htmlFor='rewardContribution' className='form-label'>
                Enter the amount in USDC you whish to contribute
              </label>
            </>
          )}
        </div>
      )}
      {props.isManager && (
        <div className='mb-2 list-inline'>
          <button
            className='btn btn-primary me-3'
            onClick={modifyRewardClickHandler}
          >
            Modify Reward
          </button>
          {/* {modifyReward && (
            
          )} */}
        </div>
      )}
    </div>
  );
};

export default ExistingReward;
