import { useState, useRef, useEffect } from 'react';
import { rewardActions } from '../../store/reward-slice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const Rewards = (props: { id: number }) => {
  const dispatch = useAppDispatch();

  const rewards = useAppSelector((state) => state.reward);

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
  }, [dispatch, props.id, title, description, value, confirmed]);

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
      {!rewards.rewards[props.id].confirmed && (
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
      {rewards.rewards[props.id].confirmed && (
        <div className='card'>
          <div className='card-body'>
            <h5 className='card-title'>Reward {props.id + 1}</h5>
            <h6 className='card-subtitle mb-2 text-muted'>
              {rewards.rewards[props.id].title}
            </h6>
            <p className='card-text'>{rewards.rewards[props.id].description}</p>
            <h6 className='card-subtitle mb-2 text-muted'>
              {rewards.rewards[props.id].value} USDC
            </h6>
            <button className='btn btn-primary' onClick={changeRewardHandler}>
              Modify Reward
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
