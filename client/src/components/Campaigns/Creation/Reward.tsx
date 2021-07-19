import { useRef, useState } from 'react';
import { rewardActions } from '../../../store/reward-slice';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { uiActions } from '../../../store/ui-slice';

const Rewards = (props: { id: number }) => {
  const dispatch = useAppDispatch();
  const [isStockLimited, setIsStockLimited] = useState<null | boolean>(null);
  const rewards = useAppSelector((state) => state.reward.rewards);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const minimumContributionRef = useRef<HTMLInputElement>(null);
  const stockLimitRef = useRef<HTMLInputElement>(null);

  const confirmRewardHandler = () => {
    if (isStockLimited === null) {
      dispatch(
        uiActions.setNotification({
          message:
            'Please indicate if there is an inventory limit for this reward!',
          type: 'alert',
        })
      );
    } else if (
      null !== titleRef.current &&
      null !== descriptionRef.current &&
      null !== minimumContributionRef.current
    ) {
      const title = titleRef.current.value;
      const description = descriptionRef.current.value;
      const minimumContribution = parseInt(
        minimumContributionRef.current.value
      );
      let stockLimit;
      if (!isStockLimited) {
        stockLimit = 0;
      } else {
        stockLimit = parseInt(stockLimitRef.current!.value);
      }
      console.log(stockLimit);
      if (title === '') {
        dispatch(
          uiActions.setNotification({
            message: 'Please enter a title for your reward!',
            type: 'alert',
          })
        );
      } else if (description === '') {
        dispatch(
          uiActions.setNotification({
            message: 'Please enter a description for your reward!',
            type: 'alert',
          })
        );
      } else if (minimumContribution === 0 || isNaN(minimumContribution)) {
        dispatch(
          uiActions.setNotification({
            message: 'Your reward value must be greater than 0!',
            type: 'alert',
          })
        );
      } else if (isStockLimited && (stockLimit === 0 || isNaN(stockLimit))) {
        dispatch(
          uiActions.setNotification({
            message: 'Please enter an inventory reward greater than 0!',
            type: 'alert',
          })
        );
      } else {
        dispatch(
          rewardActions.addReward({
            id: props.id,
            title,
            description,
            minimumContribution,
            amount: 0,
            stockLimit,
            isStockLimited,
            confirmed: true,
          })
        );
      }
    }
  };

  const stockLimitedClickHandler = (stockIsLimited: boolean) => {
    setIsStockLimited(stockIsLimited);
  };

  const changeRewardHandler = () => {
    dispatch(
      rewardActions.setConfirmed({
        id: props.id,
        confirmed: false,
      })
    );
  };

  const removeRewardHandler = () => {
    dispatch(rewardActions.removeReward({ id: props.id }));
  };

  return (
    <div className='mb-4 mt-4'>
      {!rewards[props.id].confirmed && (
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
            <button className='btn btn-primary' onClick={confirmRewardHandler}>
              Confirm Reward
            </button>
          </div>
        </div>
      )}
      {rewards[props.id].confirmed && (
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title'>Reward {props.id + 1}</h5>
            <div className='list-inline'>
              <label
                htmlFor='rewardTitle'
                className='form-label list-inline-item'
              >
                Reward Title :
              </label>
              <h5 className='card-title list-inline-item' id='rewardTitle'>
                {rewards[props.id].title}
              </h5>
            </div>
            <label htmlFor='rewardDescription' className='form-label'>
              Reward Description :
            </label>
            <p className='card-text' id='rewardDescription'>
              {rewards[props.id].description}
            </p>
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='rewardMinimumContribution'
              >
                Minimum Contribution (USDC) :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='rewardMiniumContribution'
              >
                {rewards[props.id].minimumContribution} USDC
              </h6>
            </div>
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='rewardIsStockLimit'
              >
                Minimum Contribution (USDC) :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='rewardIsStockLimit'
              >
                {rewards[props.id].isStockLimited ? 'Yes' : 'No'}
              </h6>
            </div>
            {rewards[props.id].isStockLimited && (
              <div className='list-inline'>
                <label
                  className='form-label list-inline-item'
                  htmlFor='rewardStockLimit'
                >
                  Inventory :
                </label>
                <h6
                  className='card-subtitle mb-2 list-inline-item'
                  id='rewardStockLimit'
                >
                  {rewards[props.id].stockLimit}
                </h6>
              </div>
            )}
            <div className='list-inline'>
              <button className='btn btn-primary' onClick={changeRewardHandler}>
                Modify Reward
              </button>
              <button
                className='btn btn-primary ms-3'
                onClick={removeRewardHandler}
                disabled={rewards.length < 2}
              >
                Remove Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
