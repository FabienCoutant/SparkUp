import { useEffect } from 'react';
import { useParams } from 'react-router';
import { Info } from '../../../constants';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { getRewardsList } from '../../../utils/web3React';
import { useContractCampaign } from '../../../hooks/useContract';
import CreateCampaign from '../Creation/CreateCampaign';
import { rewardActions } from '../../../store/reward-slice';
import { useWeb3React } from '@web3-react/core';

const UpdateCampaign = () => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaign);
  const { account } = useWeb3React();
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const contractCampaign = useContractCampaign(campaignAddress);

  useEffect(() => {
    if (contractCampaign) {
      const getRewards = async () => {
        const rewards = await getRewardsList(contractCampaign);
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
      getRewards();
    }
  }, [dispatch, contractCampaign]);

  const submitUpdatedCampaign = async () => {
    const durationDays = Math.round(
      (campaign.deadline!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const campaignInfo: Info = {
      title: campaign.title!,
      description: campaign.description!,
      fundingGoal: campaign.fundingGoal!,
      durationDays,
    };
    if (contractCampaign) {
      try {
        await contractCampaign.methods
          .updateCampaign(campaignInfo)
          .send({ from: account });
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <>
      <div className='mt-3'>
        <CreateCampaign showNextButton={false} />
      </div>
      <button
        className='btn btn-primary col-3 mt-3'
        onClick={submitUpdatedCampaign}
      >
        Submit Updated Campaign
      </button>
    </>
  );
};

export default UpdateCampaign;
