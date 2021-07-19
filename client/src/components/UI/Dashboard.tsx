import { Link } from 'react-router-dom';
import PlusSquareFill from '../../assets/images/PlusSquareFill';
import { useContractCampaignFactory } from '../../hooks/useContract';
import { useState, useEffect } from 'react';
import { Info } from '../../constants/index';
import { useWeb3React } from '@web3-react/core';
import Campaign from '../Campaigns/Creation/Campaign';
import { getCampaignInfo } from '../../utils/web3React';

const Dashboard = () => {
  const contractCampaignFactory = useContractCampaignFactory();
  const { library, chainId } = useWeb3React();
  const [campaigns, setCampaigns] = useState<Info[]>([]);
  const [campaignAddress, setCampaignAddress] = useState<string[]>([]);

  useEffect(() => {
    if (contractCampaignFactory && chainId && library) {
      let campaignAddress: string[] = [];
      const getCampaigns = async () => {
        try {
          campaignAddress = await contractCampaignFactory.methods
            .getDeployedCampaignsList()
            .call();
          setCampaignAddress(campaignAddress);
        } catch (error) {
          console.log(error);
        }

        const campaigns = await getCampaignInfo(campaignAddress, library);

        setCampaigns(campaigns);
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
      {campaigns.length > 0 &&
        campaigns.map((campaign) => (
          <>
            <Campaign
              campaign={campaign}
              key={campaigns.indexOf(campaign)}
              address={campaignAddress[campaigns.indexOf(campaign)]}
            />
          </>
        ))}
    </div>
  );
};

export default Dashboard;
