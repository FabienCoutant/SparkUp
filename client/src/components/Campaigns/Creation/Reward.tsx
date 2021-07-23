import {useEffect, useState} from 'react';
import {rewardActions} from '../../../store/reward-slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {uiActions} from '../../../store/ui-slice';
import {useParams} from 'react-router';
import {Link} from 'react-router-dom';
import {useContractCampaign} from '../../../hooks/useContract';
import {useWeb3React} from '@web3-react/core';
import {Rewards} from '../../../constants';

const Reward = (props: { id: number }) => {
    const dispatch = useAppDispatch();
    const {account} = useWeb3React();
    const campaign = useAppSelector((state) => state.campaign);
    const rewards = useAppSelector((state) => state.reward.rewards);
    const {campaignAddress} = useParams<{ campaignAddress: string }>();
    const contractCampaign = useContractCampaign(campaignAddress);

    const [rewardTitle, setRewardTitle] = useState(rewards[props.id].title);
    const [rewardDescription, setRewardDescription] = useState(rewards[props.id].description);
    const [rewardMinimumContribution, setRewardMinimumContribution] = useState(rewards[props.id].minimumContribution);
    const [rewardStockLimit, setRewardStockLimit] = useState(rewards[props.id].stockLimit);
    const [isManager, setIsManager] = useState(false);
    const [address, setAddress] = useState<string | undefined>(undefined);
    const [isStockLimited, setIsStockLimited] = useState(false);

    useEffect(() => {
        if (campaignAddress) {
            setAddress(campaignAddress);
        }
        if (campaign.manager === account) {
            setIsManager(true);
        } else {
            setIsManager(false);
        }
    }, [campaignAddress, account, campaign.manager]);

    const confirmRewardHandler = () => {
        if (isStockLimited === null) {
            dispatch(
                uiActions.setNotification({
                    message:
                        'Please indicate if there is an inventory limit for this reward!',
                    type: 'alert',
                })
            );
        } else if (
            "" !== rewardTitle &&
            "" !== rewardDescription &&
            undefined !== rewardMinimumContribution
        ) {
            const title = rewardTitle;
            const description = rewardDescription;
            const minimumContribution = rewardMinimumContribution;
            let stockLimit;
            if (!isStockLimited) {
                stockLimit = 0;
            } else {
                stockLimit = rewardStockLimit as number;
            }
            console.log(stockLimit);
            if (title === '') {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter a title for your reward!',
                        type: 'alert',
                    })
                );
            } else if (description === '') {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter a description for your reward!',
                        type: 'alert',
                    })
                );
            } else if (isStockLimited && (stockLimit === 0 || stockLimit === undefined)) {
                dispatch(
                    uiActions.setNotification({
                        message: 'Please enter an inventory reward greater than 0!',
                        type: 'alert',
                    })
                );
            } else {
                dispatch(
                    rewardActions.addReward({
                        id: props.id,
                        title,
                        description,
                        minimumContribution,
                        amount: 0,
                        stockLimit,
                        nbContributors: 0,
                        isStockLimited,
                        confirmed: true,
                        published: false,
                    })
                );
            }
        }
    };

    const stockLimitedClickHandler = (stockIsLimited: boolean) => {
        setIsStockLimited(stockIsLimited);
    };

    const changeRewardHandler = () => {
        dispatch(
            rewardActions.setConfirmed({
                id: props.id,
                confirmed: false,
            })
        );
    };

    const removeRewardHandler = async () => {
        if (!campaign.published) {
            dispatch(rewardActions.removeReward({id: props.id}));
        } else {
            contractCampaign?.methods.deleteReward(props.id).send({from: account});
        }
    };

    const submitRewardHandler = async () => {
        const newReward: Rewards = {
            title: rewards[props.id].title,
            description: rewards[props.id].description,
            minimumContribution: rewards[props.id].minimumContribution,
            amount: rewards[props.id].amount,
            stockLimit: rewards[props.id].stockLimit,
            nbContributors: rewards[props.id].nbContributors,
            isStockLimited: rewards[props.id].isStockLimited,
        };
        if (contractCampaign && newReward.title && newReward.description) {
            try {
                await contractCampaign?.methods
                    .addReward(newReward)
                    .send({from: account});
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className='card'>
            {!rewards[props.id].confirmed && (
                <div className='card-body'>
                    <h5 className='card-title'>Reward {props.id + 1}</h5>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='rewardTitle' className='form-label'>
                            Reward Title
                        </label>
                        <input
                            type='text'
                            className='form-control'
                            id='rewardTitle'
                            value={rewardTitle}
                            onChange={(e) => setRewardTitle(e.target.value)}
                        />
                    </div>
                    <div className='mb-3 mt-3'>
                        <label className='form-label' htmlFor='rewardDescription'>
                            Describe your reward
                        </label>
                        <textarea
                            className='form-control'
                            placeholder='Describe your campaign here'
                            id='rewardDescription'
                            style={{height: '100px'}}
                            value={rewardDescription}
                            onChange={(e) => setRewardDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='rewardMinimumContribution' className='form-label'>
                            Minimum Contribution (USDC)
                        </label>
                        <input
                            type='number'
                            className='form-control'
                            id='rewardMinimumContribution'
                            value={rewardMinimumContribution}
                            onChange={(e) => setRewardMinimumContribution(parseInt(e.target.value))}
                        />
                    </div>
                    <div className='mb-3 mt-3'>
                        <label htmlFor='isStockLimited' className='form-label'>
                            Is there an inventory limit for this reward ?
                        </label>
                        <div id='isStockLimited'>
                            <button
                                className='btn btn-primary me-3'
                                onClick={() => stockLimitedClickHandler(true)}
                            >
                                Yes
                            </button>
                            <button
                                className='btn btn-primary'
                                onClick={() => stockLimitedClickHandler(false)}
                            >
                                No
                            </button>
                        </div>
                    </div>
                    {isStockLimited && (
                        <div className='mb-3 mt-3'>
                            <label htmlFor='rewardStockLimit' className='form-label'>
                                Stock Limit
                            </label>
                            <input
                                type='number'
                                className='form-control'
                                id='rewardStockLimit'
                                value={rewardStockLimit}
                                onChange={(e) => setRewardStockLimit(parseInt(e.target.value))}
                            />
                        </div>
                    )}
                    <button className='btn btn-primary' onClick={confirmRewardHandler}>
                        Confirm Reward
                    </button>
                </div>
            )}
            {rewards[props.id].confirmed && (
                <div className='card-body'>
                    <h5 className='card-title'>Reward {props.id + 1}</h5>
                    <div className='list-inline'>
                        <label
                            htmlFor='rewardTitle'
                            className='form-label list-inline-item'
                        >
                            Reward Title :
                        </label>
                        <h5 className='card-title list-inline-item' id='rewardTitle'>
                            {rewards[props.id].title}
                        </h5>
                    </div>
                    <label htmlFor='rewardDescription' className='form-label'>
                        Reward Description :
                    </label>
                    <p className='card-text' id='rewardDescription'>
                        {rewards[props.id].description}
                    </p>
                    <div className='list-inline'>
                        <label
                            className='form-label list-inline-item'
                            htmlFor='rewardMinimumContribution'
                        >
                            Minimum Contribution (USDC) :
                        </label>
                        <h6
                            className='card-subtitle mb-2 list-inline-item'
                            id='rewardMiniumContribution'
                        >
                            {rewards[props.id].minimumContribution} USDC
                        </h6>
                    </div>
                    <div className='list-inline'>
                        <label
                            className='form-label list-inline-item'
                            htmlFor='rewardIsStockLimit'
                        >
                            Minimum Contribution (USDC) :
                        </label>
                        <h6
                            className='card-subtitle mb-2 list-inline-item'
                            id='rewardIsStockLimit'
                        >
                            {rewards[props.id].isStockLimited ? 'Yes' : 'No'}
                        </h6>
                    </div>
                    {rewards[props.id].isStockLimited && (
                        <div className='list-inline'>
                            <label
                                className='form-label list-inline-item'
                                htmlFor='rewardStockLimit'
                            >
                                Inventory :
                            </label>
                            <h6
                                className='card-subtitle mb-2 list-inline-item'
                                id='rewardStockLimit'
                            >
                                {rewards[props.id].stockLimit}
                            </h6>
                        </div>
                    )}
                    <div className='list-inline'>
                        {!rewards[props.id].published && (
                            <button
                                className='btn btn-primary'
                                onClick={() => changeRewardHandler()}
                            >
                                Modify Reward
                            </button>
                        )}
                        {rewards[props.id].published && isManager && (
                            <>
                                <Link
                                    to={`/campaign-details/${address}/updateReward/${props.id}`}
                                >
                                    <button className='btn btn-primary me-3'>
                                        Update Reward
                                    </button>
                                </Link>
                                <button
                                    className='btn btn-primary'
                                    onClick={() => removeRewardHandler()}
                                >
                                    Remove Reward
                                </button>
                            </>
                        )}
                        {!rewards[props.id].published && (
                            <>
                                <button
                                    className='btn btn-primary ms-3'
                                    onClick={() => removeRewardHandler()}
                                    disabled={rewards.length < 2}
                                >
                                    Remove Reward
                                </button>
                                <button
                                    className='btn btn-primary ms-3'
                                    onClick={() => submitRewardHandler()}
                                    disabled={rewards.length < 2}
                                >
                                    Submit Reward
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reward;
