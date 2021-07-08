const Notification: React.FC<{ message: string }> = (props) => {
  return (
    <div
      className='card position-absolute top-50 start-50 translate-middle'
      style={{ width: '18rem' }}
    >
      <div className='card-body'>
        <h5 className='card-title'>Oops, an error has occured!</h5>
        <p className='card-text'>{props.message}</p>
      </div>
    </div>
  );
};

export default Notification;
