import { useRef } from 'react';
import { rewardActions } from '../../store/reward-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { uiActions } from '../../store/ui-slice';

const Rewards = (props: { id: number }) => {
  const dispatch = useAppDispatch();

  const rewards = useAppSelector((state) => state.reward.rewards);

  const rewardTitleRef = useRef<HTMLInputElement>(null);
  const rewardDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const rewardValueRef = useRef<HTMLInputElement>(null);

  const confirmRewardHandler = () => {
    if (
      null !== rewardTitleRef.current &&
      null !== rewardDescriptionRef.current &&
      null !== rewardValueRef.current
    ) {
      const title = rewardTitleRef.current.value;
      const description = rewardDescriptionRef.current.value;
      const value = parseInt(rewardValueRef.current.value);

      if (title === '') {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Please enter a title for your reward!',
            type: 'alert',
          })
        );
      } else if (description === '') {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Please enter a description for your reward!',
            type: 'alert',
          })
        );
      } else if (value === 0 || isNaN(value)) {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'Your reward value must be greater than 0!',
            type: 'alert',
          })
        );
      } else {
        dispatch(
          rewardActions.addReward({
            id: props.id,
            title,
            description,
            value,
            confirmed: true,
          })
        );
      }
    }
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
                ref={rewardTitleRef}
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
                ref={rewardDescriptionRef}
              ></textarea>
            </div>
            <div className='mb-3 mt-3'>
              <label htmlFor='rewardValue' className='form-label'>
                Reward value (USDC)
              </label>
              <input
                type='number'
                className='form-control'
                id='rewardValue'
                ref={rewardValueRef}
              />
            </div>
            <button className='btn btn-primary' onClick={confirmRewardHandler}>
              Validate Reward
            </button>
          </div>
        </div>
      )}
      {rewards[props.id].confirmed && (
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title'>Reward {props.id + 1}</h5>
            <h6 className='card-subtitle mb-2 text-muted'>
              {rewards[props.id].title}
            </h6>
            <p className='card-text'>{rewards[props.id].description}</p>
            <h6 className='card-subtitle mb-2 text-muted'>
              {rewards[props.id].value} USDC
            </h6>
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
