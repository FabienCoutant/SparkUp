import { Link } from 'react-router-dom';

const NextButton = (props: { route: string; disabled: boolean }) => {
  return (
    <>
      <Link to={props.route} style={{ textDecoration: 'none', color: 'white' }}>
        <button
          type='submit'
          className='btn btn-primary mt-3'
          disabled={props.disabled}
        >
          Next
        </button>
      </Link>
    </>
  );
};

export default NextButton;
