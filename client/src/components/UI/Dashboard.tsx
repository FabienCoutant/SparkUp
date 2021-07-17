import { Link } from 'react-router-dom';
import PlusSquareFill from '../../assets/images/PlusSquareFill';
import { useContractCampaignFactory } from '../../hooks/useContract';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const contractCampaignFactory = useContractCampaignFactory();
  const [campaigns, setCampaigns] = useState<any>([]);
  useEffect(() => {
    if (contractCampaignFactory) {
      const getCampaigns = async () => {
        const campaignAddress: string[] = await contractCampaignFactory.methods
          .getDeployedCampaignsList()
          .call();
        console.log(campaignAddress);
        const campaigns = [];
        campaignAddress.map((campaign) => async () => {});
      };
      getCampaigns();
    }
  }, [contractCampaignFactory]);

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
      <h1 className='mt-3'>Campaigns</h1>
    </div>
  );
};

export default Dashboard;
