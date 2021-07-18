import { Link } from 'react-router-dom';
import PlusSquareFill from '../../assets/images/PlusSquareFill';
import { useContractCampaignFactory } from '../../hooks/useContract';
import { useState, useEffect } from 'react';
import { Info } from '../../constants/index';
import { useWeb3React } from '@web3-react/core';
import { getTestContract } from '../../utils/web3React';
import Campaign from '../Campaigns/Campaign';
import CampaignJSON from '../../contracts/Campaign.json';

const Dashboard = () => {
  const contractCampaignFactory = useContractCampaignFactory();
  const { library, chainId } = useWeb3React();
  const [campaigns, setCampaigns] = useState<Info[]>([]);

  useEffect(() => {
    if (contractCampaignFactory && chainId && library) {
      const getCampaigns = async () => {
        const campaignAddress: string[] = await contractCampaignFactory.methods
          .getDeployedCampaignsList()
          .call();
        console.log(await campaignAddress);
        const campaigns: Info[] = [];
        campaignAddress.map((campaign) => async () => {
          try {
            const contract = getTestContract(
              CampaignJSON,
              library,
              chainId,
              campaign
            );
            const campaignInfo = await contract?.methods.campaignInfo().call();
            campaigns.push(campaignInfo);
            return campaigns;
          } catch (error) {
            console.error('Failed to get contract', error);
            return null;
          }
        });
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
        campaigns.map((campaign) => <Campaign campaign={campaign} />)}
    </div>
  );
};

export default Dashboard;
