import { Link } from 'react-router-dom';
import PlusSquareFill from '../../assets/images/PlusSquareFill';
const Dashboard = () => {
  return (
    <div className='mt-5'>
      <Link
        to='/createcampaign'
        style={{ textDecoration: 'none', color: 'white' }}
      >
        <button type='button' className='btn btn-secondary gap-2'>
          <PlusSquareFill />
          <span className='align-middle'>Create Campaign</span>
        </button>
      </Link>
    </div>
  );
};

export default Dashboard;
