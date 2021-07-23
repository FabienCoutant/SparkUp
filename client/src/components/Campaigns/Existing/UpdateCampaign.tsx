import {useEffect} from 'react';
import {useParams} from 'react-router';
import {Info} from '../../../constants';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {getCampaignInfo} from '../../../utils/web3React';
import {useContractCampaign} from '../../../hooks/useContract';
import CreateCampaign from '../Creation/CreateCampaign';
import {useWeb3React} from '@web3-react/core';
import {campaignActions} from '../../../store/campaign-slice';

const UpdateCampaign = () => {
    const dispatch = useAppDispatch();
    const campaign = useAppSelector((state) => state.campaign);
    const {account, library} = useWeb3React();
    const {campaignAddress} = useParams<{ campaignAddress: string }>();
    const contractCampaign = useContractCampaign(campaignAddress);

    useEffect(() => {
        if (contractCampaign) {
            const getCampaign = async () => {
                const campaignInfo = await getCampaignInfo(campaignAddress, library);
                const manager = await contractCampaign.methods.manager().call();
                if (campaignInfo) {
                    dispatch(
                        campaignActions.setCampaign({
                            title: campaignInfo.title,
                            description: campaignInfo.description,
                            fundingGoal: campaignInfo.fundingGoal,
                            durationDays: campaignInfo.durationDays,
                            confirmed: false,
                            published: true,
                            manager,
                        })
                    );
                }
            };
            getCampaign();
        }
    }, [dispatch, contractCampaign, campaignAddress]);

    const submitUpdatedCampaign = async () => {
        const durationDays = Math.round(
            (campaign.durationDays - Date.now()) / (1000 * 60 * 60 * 24)
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
                    .send({from: account});
            } catch (error) {
                throw error;
            }
        }
    };

    return (
        <>
            <div className='mt-3'>
                <CreateCampaign showNextButton={false}/>
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
