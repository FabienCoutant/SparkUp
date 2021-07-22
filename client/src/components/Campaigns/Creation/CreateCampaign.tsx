import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {campaignActions} from '../../../store/campaign-slice';
import {uiActions} from '../../../store/ui-slice';
import {rewardActions} from '../../../store/reward-slice';
import Campaign from './Campaign';
import NextButton from '../../UI/NextButton';
import {isValidDate} from '../../../utils/web3React';
import {useWeb3React} from '@web3-react/core';
import {useLocation, useParams} from 'react-router';
import {useContractCampaign} from '../../../hooks/useContract';

const CreateCampaign = (props?: { showNextButton: boolean }) => {
    const {pathname} = useLocation();
    const dispatch = useAppDispatch();
    const {account} = useWeb3React();
    const campaign = useAppSelector((state) => state.campaign);
    const {campaignAddress} = useParams<{ campaignAddress: string }>();
    const contractCampaign = useContractCampaign(campaignAddress);

    const [campaignTitle, setCampaignTitle] = useState(campaign.title);
    const [campaignDescription, setCampaignDescription] = useState(campaign.description);
    const [campaignFundingGoal, setCampaignFundingGoal] = useState(campaign.fundingGoal);
    const [campaignDeadLine, setCampaignDeadLine] = useState(campaign.durationDays);
    const [createAt, setCreateAt] = useState(new Date());

    useEffect(() => {
        if (pathname === '/createcampaign') {
            dispatch(
                campaignActions.setCampaign({
                    title: "",
                    description: "",
                    fundingGoal: 10000,
                    durationDays: new Date().setDate(Date.now() + 7),
                    confirmed: false,
                    published: false,
                    manager: "",
                })
            );
            dispatch(
                rewardActions.setState({
                    newState: {
                        id: 0,
                        title: "",
                        description: "",
                        minimumContribution: 0,
                        amount: 0,
                        stockLimit: 0,
                        nbContributors: 0,
                        isStockLimited: false,
                        confirmed: false,
                        published: false,
                    },
                })
            );
        }
    }, [dispatch, pathname]);

    useEffect(() => {
        const getCreateAt = async () => {
            if (contractCampaign) {
                const _createAt = await contractCampaign.methods.createAt().call();
                setCreateAt(new Date(_createAt * 1000));
            }
        }
        getCreateAt();
    }, [campaign])

    const campaignSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (
            "" !== campaignTitle &&
            "" !== campaignDescription
        ) {
            const title = campaignTitle;
            const description = campaignDescription;
            const fundingGoal = campaignFundingGoal;
            const deadline = new Date(campaignDeadLine as number);

            if (title === '') {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter a title for your campaign!',
                        type: 'alert',
                    })
                );
            } else if (description === '') {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter a description for your campaign!',
                        type: 'alert',
                    })
                );
            } else if (fundingGoal === undefined || fundingGoal < 10000) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Your funding goal must be at least 10 000 USDC!',
                        type: 'alert',
                    })
                );
            } else if (!isValidDate(deadline, createAt)) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter a deadline for your campaign more than 7 days from now!',
                        type: 'alert',
                    })
                );
            } else {
                dispatch(
                    campaignActions.setCampaign({
                        title,
                        description,
                        fundingGoal,
                        durationDays: new Date(deadline).getTime(),
                        confirmed: true,
                        published: false,
                        manager: account!,
                    })
                );
            }
        }
    };

    const modifyCampaignHandler = () => {
        dispatch(campaignActions.setConfirmed({confirmed: false}));
    };

    const deleteCampaignHandler = async () => {
        if (contractCampaign) {
            await contractCampaign.methods.deleteCampaign().send({from: account});
        }
    };

    return (
        <>
            {!campaign.confirmed && (
                <form onSubmit={campaignSubmitHandler}>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='campaignTitle' className='form-label'>
                            Campaign Title
                        </label>
                        <input
                            type='text'
                            className='form-control'
                            id='campaignTitle'
                            value={campaignTitle}
                            onChange={(e) => setCampaignTitle(e.target.value)}
                        />
                    </div>
                    <div className='mb-3 mt-3'>
                        <label className='form-label' htmlFor='campaignDescription'>
                            Comments
                        </label>
                        <textarea
                            className='form-control'
                            placeholder='Describe your campaign here'
                            id='campaignDescription'
                            style={{height: '100px'}}
                            value={campaignDescription}
                            onChange={(e) => setCampaignDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='fundingGoal' className='form-label'>
                            Funding Goal (USDC)
                        </label>
                        <input
                            type='number'
                            className='form-control'
                            id='fundingGoal'
                            value={campaignFundingGoal}
                            onChange={(e) => setCampaignFundingGoal(parseInt(e.target.value))}
                        />
                    </div>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='fundingGoal' className='form-label'>
                            Deadline
                        </label>
                        <input
                            type='date'
                            className='form-control'
                            id='deadLine'
                            value={campaignDeadLine}
                            onChange={(e) => setCampaignDeadLine(parseInt(e.target.value))}
                        />
                    </div>
                    <button type='submit' className='btn btn-primary'>
                        Confirm Campaign
                    </button>
                </form>
            )}
            {campaign.confirmed && (
                <div className='mt-3'>
                    <Campaign address={null}/>
                    {!campaign.published && (
                        <button
                            className='btn btn-primary mb-3'
                            onClick={modifyCampaignHandler}
                        >
                            Modify Campaign
                        </button>
                    )}
                    {campaign.published && (
                        <button
                            className='btn btn-primary mb-3'
                            onClick={deleteCampaignHandler}
                        >
                            Delete Campaign
                        </button>
                    )}
                </div>
            )}
            {props?.showNextButton && (
                <NextButton
                    route='/createcampaign/rewards'
                    disabled={!campaign.confirmed}
                />
            )}
        </>
    );
};

export default CreateCampaign;
