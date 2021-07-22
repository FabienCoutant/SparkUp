import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getCampaignInfo, getRewardsList } from '../../../utils/web3React';
import { useWeb3React } from '@web3-react/core';
import { useContractCampaign } from '../../../hooks/useContract';
import { useAppDispatch } from '../../../store/hooks';
import { rewardActions } from '../../../store/reward-slice';
import { campaignActions } from '../../../store/campaign-slice';
import ConfirmCampaing from '../Creation/ConfirmCampaign';

const CampaignDetails = () => {
  const dispatch = useAppDispatch();
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const { library } = useWeb3React();
  const contractCampaign = useContractCampaign(campaignAddress);

  useEffect(() => {
    if (contractCampaign) {
      const getRewards = async () => {
        const rewards = await getRewardsList(contractCampaign);
        dispatch(
          rewardActions.setState({
            newState: {
              id: 0,
              title: null,
              description: null,
              minimumContribution: null,
              amount: 0,
              stockLimit: null,
              nbContributors: 0,
              isStockLimited: null,
              confirmed: false,
              published: null,
            },
          })
        );
        for (const reward of rewards) {
          dispatch(
            rewardActions.addReward({
              id: rewards.indexOf(reward),
              title: reward.title,
              description: reward.description,
              minimumContribution: reward.minimumContribution,
              amount: reward.amount,
              stockLimit: reward.stockLimit,
              nbContributors: reward.nbContributors,
              isStockLimited: reward.isStockLimited,
              confirmed: true,
              published: true,
            })
          );
        }
      };
      const getCampaign = async () => {
        const campaignInfo = await getCampaignInfo(campaignAddress, library);
        const manager = await contractCampaign.methods.manager().call();
        if (campaignInfo) {
          dispatch(
            campaignActions.setCampaign({
              title: campaignInfo.title,
              description: campaignInfo.description,
              fundingGoal: campaignInfo.fundingGoal,
              deadline: campaignInfo.durationDays,
              confirmed: true,
              published: true,
              manager,
            })
          );
        }
      };
      getCampaign();
      getRewards();
    }
  }, [dispatch, contractCampaign, campaignAddress, library]);

  return <ConfirmCampaing />;
};

export default CampaignDetails;
