import { useState, useRef, useEffect } from 'react';
import { rewardActions } from '../../store/reward-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { uiActions } from '../../store/ui-slice';

const Rewards = (props: { id: number }) => {
  const dispatch = useAppDispatch();

  const rewards = useAppSelector((state) => state.reward.rewards);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const [confirmed, setConfirmed] = useState(false);

  const rewardTitleRef = useRef<HTMLInputElement>(null);
  const rewardDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const rewardValueRef = useRef<HTMLInputElement>(null);

  const confirmRewardHandler = () => {
    if (
      null !== rewardTitleRef.current &&
      null !== rewardDescriptionRef.current &&
      null !== rewardValueRef.current
    ) {
      setTitle(rewardTitleRef.current.value);
      setDescription(rewardDescriptionRef.current.value);
      setValue(parseInt(rewardValueRef.current.value));
      setConfirmed(true);
    }
  };

  useEffect(() => {
    if (props.id > 0 && props.id < rewards.length - 1) {
      if (value <= rewards[props.id - 1].value!) {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'The reward value must be more than the previous one!',
            type: 'alert',
          })
        );
      }
      if (value >= rewards[props.id + 1].value!) {
        dispatch(
          uiActions.setNotification({
            display: true,
            message: 'The reward value must be less than the next one!',
            type: 'alert',
          })
        );
      }
    }
    if (title !== '' && description !== '' && value !== 0 && confirmed) {
      dispatch(
        rewardActions.addReward({
          id: props.id,
          title,
          description,
          value,
          confirmed,
        })
      );
    }
  }, [dispatch, props.id, title, description, value, confirmed, rewards]);

  const changeRewardHandler = () => {
    dispatch(
      rewardActions.addReward({
        id: props.id,
        title,
        description,
        value,
        confirmed: false,
      })
    );
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
                onClick={changeRewardHandler}
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
