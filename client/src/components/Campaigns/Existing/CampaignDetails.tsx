import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCampaignInfo, getRewardsList } from '../../../utils/web3React';
import { useWeb3React } from '@web3-react/core';
import { useContractCampaign } from '../../../hooks/useContract';
import Campaign from '../Creation/Campaign';
import Reward from '../Creation/Reward';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { rewardActions } from '../../../store/reward-slice';
import { campaignActions } from '../../../store/campaign-slice';
import ConfirmCampaing from '../Creation/ConfirmCampaign';

const CampaignDetails = () => {
  const dispatch = useAppDispatch();
  const campaign = useAppSelector((state) => state.campaign);
  const rewards = useAppSelector((state) => state.reward.rewards);
  const [isManager, setIsManager] = useState(false);
  const { campaignAddress } = useParams<{ campaignAddress: string }>();
  const { library, account } = useWeb3React();
  const contractCampaign = useContractCampaign(campaignAddress);

  // const addRewardHandler = () => {
  //   dispatch(
  //     rewardActions.addReward({
  //       id: rewards.length,
  //       title: null,
  //       description: null,
  //       minimumContribution: null,
  //       amount: null,
  //       stockLimit: null,
  //       nbContributors: null,
  //       isStockLimited: null,
  //       confirmed: false,
  //     })
  //   );
  // };

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
    <ConfirmCampaing />
    // <div className='mt-3'>
    //   {campaignInfo && <Campaign address={campaignAddress} />}
    //   {isManager && (
    //     <div className='text-center'>
    //       <Link
    //         to={`/campaign-details/${campaignAddress}/updateCampaign`}
    //         style={{ textDecoration: 'none', color: 'white' }}
    //       >
    //         <button
    //           type='button'
    //           className='btn btn-primary mt-4 mb-4'
    //           style={{ width: '250px' }}
    //         >
    //           Update Camapaign
    //         </button>
    //       </Link>
    //     </div>
    //   )}
    //   {rewards.map((reward) => (
    //     <div className='card mb-3 mt-3' key={rewards.indexOf(reward)}>
    //       <Reward
    //         rewardInfo={reward}
    //         id={rewards.indexOf(reward)}
    //         isManager={isManager}
    //       />
    //     </div>
    //   ))}
    //   {isManager && (
    //     <>
    //       <button
    //         type='button'
    //         className='btn btn-primary mt-3'
    //         onClick={addRewardHandler}
    //       >
    //         Add Reward
    //       </button>
    //       <div className='text-center'>
    //         <button type='button' className='btn btn-primary mt-4'>
    //           Update All Camapaign Rewards
    //         </button>
    //       </div>
    //     </>
    //   )}
    // </div>
  );
};

export default CampaignDetails;
