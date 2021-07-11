import { useAppSelector } from '../../store/hooks';

const Notification = () => {
  const message = useAppSelector((state) => state.ui.message);

  return (
    <div
      className='card position-absolute top-50 start-50 translate-middle'
      style={{ width: '18rem' }}
    >
      <div className='card-body'>
        <h5 className='card-title'>Oops, an error has occured!</h5>
        <p className='card-text'>{message}</p>
      </div>
    </div>
  );
};

export default Notification;
