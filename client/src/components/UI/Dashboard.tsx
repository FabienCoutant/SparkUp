import { Link } from 'react-router-dom';
import PlusSquareFill from '../../assets/images/PlusSquareFill';
import { useContractCampaignFactory } from '../../hooks/useContract';
import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Campaign from '../Campaigns/Creation/Campaign';

const Dashboard = () => {
  const contractCampaignFactory = useContractCampaignFactory();
  const { library, chainId } = useWeb3React();
  const [campaignAddress, setCampaignAddress] = useState<string[]>([]);

  useEffect(() => {
    if (contractCampaignFactory && chainId && library) {
      const getCampaigns = async () => {
        try {
          const _campaignAddress: string[] =
            await contractCampaignFactory.methods
              .getDeployedCampaignsList()
              .call();
          setCampaignAddress(_campaignAddress);
        } catch (error) {
          console.log(error);
        }
      };
      getCampaigns();
    }
  }, [contractCampaignFactory, chainId, library]);

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
      {campaignAddress.length > 0 &&
        campaignAddress.map((campaign) => (
          <Campaign
            key={campaign}
            address={campaignAddress[campaignAddress.indexOf(campaign)]}
          />
        ))}
    </div>
  );
};

export default Dashboard;
