import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {notificationActions} from '../../store/Notification/slice';
import {NOTIFICATION_TYPE} from "../../constants";

const Notification = () => {
  const dispatch = useAppDispatch();

  const message = useAppSelector((state) => state.notification.message);
  const type = useAppSelector((state) => state.notification.type);
  const dismissAlert = () => {
    dispatch(notificationActions.hideNotification());
  };

  return (
    <>
      {type === NOTIFICATION_TYPE.ERROR && (
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
      {type === NOTIFICATION_TYPE.ALERT && (
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
          />
        </div>
      )}
    </>
  );
};

export default Notification;
