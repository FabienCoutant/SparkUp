import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCampaignInfo, getRewardsList } from '../../../utils/web3React';
import { useWeb3React } from '@web3-react/core';
import { Info, Rewards } from '../../../constants/index';
import { useContractCampaign } from '../../../hooks/useContract';
import ExistingCampaign from './ExistingCampaign';
import ExistingReward from './ExistingReward';

const CampaignDetails = () => {
  const [campaignInfo, setCampaignInfo] = useState<Info | null>();
  const [rewards, setRewards] = useState<Rewards[]>([]);
  const [isManager, setIsManager] = useState(false);
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const address = campaignAddress.slice(1, campaignAddress.length);
  const { library, account } = useWeb3React();
  const contractCampaign = useContractCampaign(address);

  useEffect(() => {
    const getCampaign = async () => {
      const campaignInfo = await getCampaignInfo([address], library);
      if (campaignInfo.length > 0) {
        setCampaignInfo(campaignInfo[0]);
      } else {
        setCampaignInfo(null);
      }
    };
    const getRewards = async () => {
      const rewards = await getRewardsList(contractCampaign);
      setRewards(rewards);
    };
    getCampaign();
    getRewards();
  }, [library, address, contractCampaign]);

  useEffect(() => {
    const checkOwnership = async () => {
      const manager = await contractCampaign?.methods.manager().call();
      if (account === manager) {
        setIsManager(true);
      } else {
        setIsManager(false);
      }
    };
    checkOwnership();
  }, [account, contractCampaign]);

  return (
    <div className='mt-3'>
      {campaignInfo && <ExistingCampaign campaignInfo={campaignInfo} />}
      {rewards.map((reward) => (
        <div className='card mb-3 mt-3' key={rewards.indexOf(reward)}>
          <ExistingReward reward={reward} isManager={isManager} />
        </div>
      ))}
    </div>
  );
};

export default CampaignDetails;
