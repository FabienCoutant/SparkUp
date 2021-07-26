import {useParams} from 'react-router-dom';
import {useEffect} from 'react';
import {useFetchRewardsList} from '../../hooks/useFetchRewards'
import {useWeb3React} from '@web3-react/core';
import {useContractCampaign} from '../../hooks/useContract';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {rewardActions} from '../../store/Reward/slice';
import {campaignActions} from '../../store/Campaign/slice';
import RewardCard from "../../components/RewardCard";
import CampaignCard from "../../components/CampaignCard";
import { RENDER_TYPE } from '../../constants'
import { useFetchCampaignInfo } from '../../hooks/useFetchCampaign'

const CampaignDetails = () => {
    const {campaignAddress} = useParams<{ campaignAddress: string }>();
    const rewards = useFetchRewardsList(campaignAddress);
    const campaignInfo = useFetchCampaignInfo(campaignAddress)



    return (
        <>
            <CampaignCard address={campaignAddress} renderType={RENDER_TYPE.DETAIL}/>
            {
                rewards.map((reward, index) => (
                    <div className='card mb-3 mt-3' key={index}>
                        <RewardCard id={index}/>
                    </div>
                ))
            }
        </>
    );
}
;

export default CampaignDetails;
