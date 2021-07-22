import { useParams } from 'react-router';
import { useRef, useState, useEffect } from 'react';
import { useContractCampaign } from '../../../hooks/useContract';
import { useWeb3React } from '@web3-react/core';
import { Rewards } from '../../../constants';

const UpdateReward = (props: { rewardId: number | null }) => {
  const [rewardId, setRewardId] = useState<number | null>(null);
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const rewardIdParams = useParams<{ rewardId: string }>().rewardId;
  const { account } = useWeb3React();
  const contractCampaign = useContractCampaign(campaignAddress);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const minimumContributionRef = useRef<HTMLInputElement>(null);
  const stockLimitRef = useRef<HTMLInputElement>(null);

  const [isStockLimited, setIsStockLimited] = useState<null | boolean>(null);

  useEffect(() => {
    if (props.rewardId !== null) {
      setRewardId(props.rewardId);
    } else {
      setRewardId(parseInt(rewardIdParams));
    }
  }, [props.rewardId, rewardIdParams]);

  const stockLimitedClickHandler = (stockIsLimited: boolean) => {
    setIsStockLimited(stockIsLimited);
  };

  const updateRewardHandler = async () => {
    console.log('check');
    if (
      titleRef.current &&
      descriptionRef.current &&
      minimumContributionRef.current
    ) {
      const newReward: Rewards = {
        title: titleRef.current.value,
        description: descriptionRef.current.value,
        minimumContribution: parseInt(minimumContributionRef.current.value),
        amount: 0,
        stockLimit: 0,
        nbContributors: 0,
        isStockLimited: isStockLimited,
      };

      if (isStockLimited && stockLimitRef.current) {
        newReward.stockLimit = parseInt(stockLimitRef.current.value);
      }

      await contractCampaign?.methods
        .updateRewardData(newReward, rewardId)
        .send({ from: account });
    }
  };

  return (
    <div className='card mt-5'>
      <div className='card-body'>
        <h5 className='card-title'>
          Reward {rewardId !== null && rewardId + 1}
        </h5>
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
        <button
          className='btn btn-primary mt-3 me-3'
          onClick={updateRewardHandler}
        >
          Update Reward
        </button>
        <button className='btn btn-primary mt-3' onClick={updateRewardHandler}>
          Remove Reward
        </button>
      </div>
    </div>
  );
};

export default UpdateReward;
