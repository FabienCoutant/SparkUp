import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import CreateCampaign from './CreateCampaign';
import Reward from './Reward';
import { reward } from '../../store/reward-slice';
import { useWeb3React } from '@web3-react/core';
import { uiActions } from '../../store/ui-slice';
import { Info, Rewards } from '../../constants';
import { useContractCampaignFactory } from '../../hooks/useContract';

const ConfirmCampaing = () => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaign);
  const rewards = useAppSelector((state) => state.reward.rewards);
  const [campaignDuration, setCampaignDuration] = useState<number | null>(null);
  const { chainId, account } = useWeb3React();
  const contractCampaignFactory = useContractCampaignFactory();

  useEffect(() => {
    if (!campaign.confirmed || !rewards[0].confirmed) {
      dispatch(
        uiActions.setNotification({
          message:
            'You must confirm a campaign and its rewards to access this page!',
          type: 'error',
        })
      );
    } else {
      setCampaignDuration(
        Math.round(
          (campaign.deadline!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      );
    }
  }, []);

  const submitCampaignHandler = async () => {
    if (chainId) {
      const campaignInfo: Info = {
        title: campaign.title!,
        description: campaign.description!,
        fundingGoal: campaign.fundingGoal!,
        durationDays: campaignDuration!,
      };
      const rewardsInfo: Rewards[] = [];
      rewards.map((reward) => {
        const tempReward: Rewards = {
          title: reward.title!,
          description: reward.description!,
          minimumContribution: reward.minimumContribution!,
          amount: 0!,
          stockLimit: reward.stockLimit!,
          nbContributors: 0,
          isStockLimited: reward.isStockLimited!,
        };
        rewardsInfo.push(tempReward);
        return rewardsInfo;
      });
      console.log(rewardsInfo);
      try {
        await contractCampaignFactory!.methods
          .createCampaign(campaignInfo, rewardsInfo)
          .send({ from: account });
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <>
      {campaign.confirmed && rewards[0].confirmed && (
        <>
          <h1 className='mt-5 mb-5 text-center'>Campaign Summuary</h1>
          <CreateCampaign showNextButton={false} />
          {rewards.map((reward: reward) => {
            return <Reward id={reward.id} key={reward.id} />;
          })}
          <div className='text-center'>
            <button
              className='btn btn-primary mb-3'
              onClick={submitCampaignHandler}
              style={{ width: '25%' }}
            >
              Submit Campaign
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default ConfirmCampaing;
