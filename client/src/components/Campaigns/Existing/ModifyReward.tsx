import { Rewards } from '../../../constants';
import { useRef, useState } from 'react';
const ModifyReward = (props: { reward: Rewards; id: number }) => {
  const [isStockLimited, setIsStockLimited] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const minimumContributionRef = useRef<HTMLInputElement>(null);
  const stockLimitRef = useRef<HTMLInputElement>(null);

  const stockLimitedClickHandler = (stockIsLimited: boolean) => {
    setIsStockLimited(stockIsLimited);
  };

  return (
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'>Reward {props.id + 1}</h5>
        <div className='mb-3 mt-3'>
          <label htmlFor='rewardTitle' className='form-label'>
            Reward Title
          </label>
          <input
            type='text'
            className='form-control'
            id='rewardTitle'
            ref={titleRef}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label className='form-label' htmlFor='rewardDescription'>
            Describe your reward
          </label>
          <textarea
            className='form-control'
            placeholder='Describe your campaign here'
            id='rewardDescription'
            style={{ height: '100px' }}
            ref={descriptionRef}
          ></textarea>
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='rewardMinimumContribution' className='form-label'>
            Minimum Contribution (USDC)
          </label>
          <input
            type='number'
            className='form-control'
            id='rewardMinimumContribution'
            ref={minimumContributionRef}
          />
        </div>
        <div className='mb-3 mt-3'>
          <label htmlFor='isStockLimited' className='form-label'>
            Is there an inventory limit for this reward ?
          </label>
          <div id='isStockLimited'>
            <button
              className='btn btn-primary me-3'
              onClick={() => stockLimitedClickHandler(true)}
            >
              Yes
            </button>
            <button
              className='btn btn-primary'
              onClick={() => stockLimitedClickHandler(false)}
            >
              No
            </button>
          </div>
        </div>
        {isStockLimited && (
          <div className='mb-3 mt-3'>
            <label htmlFor='rewardStockLimit' className='form-label'>
              Stock Limit
            </label>
            <input
              type='number'
              className='form-control'
              id='rewardStockLimit'
              ref={stockLimitRef}
            />
          </div>
        )}
        <button className='btn btn-primary'>Confirm Reward</button>
      </div>
    </div>
  );
};

export default ModifyReward;
