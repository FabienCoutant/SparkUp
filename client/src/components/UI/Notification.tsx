import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { uiActions } from '../../store/ui-slice';

const Notification = () => {
  const dispatch = useAppDispatch();

  const message = useAppSelector((state) => state.ui.message);
  const type = useAppSelector((state) => state.ui.type);
  const dismissAlert = () => {
    dispatch(uiActions.hideNotification());
  };

  return (
    <>
      {type === 'error' && (
        <div
          className='card position-absolute top-50 start-50 translate-middle'
          style={{ width: '18rem' }}
        >
          <div className='card-body'>
            <h5 className='card-title'>Oops, an error has occured!</h5>
            <p className='card-text'>{message}</p>
          </div>
        </div>
      )}
      {type === 'alert' && (
        <div
          className='alert alert-danger alert-dismissible fade show'
          role='alert'
        >
          {message}
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
            onClick={dismissAlert}
          ></button>
        </div>
      )}
    </>
  );
};

export default Notification;
