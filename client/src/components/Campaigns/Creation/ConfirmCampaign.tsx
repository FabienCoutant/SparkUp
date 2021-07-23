import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import CreateCampaign from './CreateCampaign';
import Reward from './Reward';
import { reward } from '../../../store/reward-slice';
import { useWeb3React } from '@web3-react/core';
import { uiActions } from '../../../store/ui-slice';
import { Info, Rewards } from '../../../constants';
import { useContractCampaignFactory } from '../../../hooks/useContract';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { rewardActions } from '../../../store/reward-slice';

const ConfirmCampaign = () => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaign);
  const rewards = useAppSelector((state) => state.reward.rewards);
  const [campaignDuration, setCampaignDuration] = useState<number | null>(null);
  const { chainId, account } = useWeb3React();
  const contractCampaignFactory = useContractCampaignFactory();
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const [isManager, setIsManager] = useState<boolean | null>(null);

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
          (new Date(campaign.durationDays).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24)
        )
      );
      dispatch(uiActions.hideNotification());
    }
    if (account && campaign.manager === account) {
      setIsManager(true);
    } else {
      setIsManager(false);
    }
  }, [dispatch, rewards, account, campaign]);

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
        await contractCampaignFactory?.methods
          .createCampaign(campaignInfo, rewardsInfo)
          .send({ from: account });
      } catch (error) {
        throw error;
      }
    }
  };

  const addRewardHandler = () => {
    dispatch(
      rewardActions.addReward({
        id: rewards.length,
        title: "",
        description: "",
        minimumContribution: 0,
        amount: 0,
        stockLimit: 0,
        nbContributors: 0,
        isStockLimited: false,
        confirmed: false,
        published: false,
      })
    );
  };

  if (!campaign.published) {
    return (
      <>
        {campaign.confirmed && rewards[0].confirmed && (
          <>
            <h1 className='mt-5 mb-5 text-center'>Campaign Summuary</h1>
            <CreateCampaign showNextButton={false} />
            {rewards.map((reward: reward) => {
              return (
                <div className='mb-3' key={reward.id}>
                  <Reward id={reward.id} />
                </div>
              );
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
  } else {
    return (
      <div className='mt-3'>
        {campaign && <CreateCampaign showNextButton={false} />}
        {isManager && (
          <div className='text-center'>
            <Link
              to={`/campaign-details/${campaignAddress}/updateCampaign`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <button
                type='button'
                className='btn btn-primary mt-4 mb-4'
                style={{ width: '250px' }}
              >
                Update Camapaign
              </button>
            </Link>
          </div>
        )}
        {rewards.map((reward) => (
          <div className='card mb-3 mt-3' key={rewards.indexOf(reward)}>
            <Reward id={rewards.indexOf(reward)} />
          </div>
        ))}
        {isManager && (
          <>
            <button
              type='button'
              className='btn btn-primary mt-3'
              onClick={addRewardHandler}
            >
              Add Reward
            </button>
          </>
        )}
      </div>
    );
  }
};

export default ConfirmCampaign;
