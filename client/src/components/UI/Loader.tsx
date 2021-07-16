const Loader = () => {
  return (
    <div
      className='spinner-border position-absolute top-50 start-50 translate-middle'
      role='status'
    >
      <span className='visually-hidden'>Loading...</span>
    </div>
  );
};

export default Loader;
