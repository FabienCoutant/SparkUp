import {notificationActions} from "../../store/Notification/slice";
import { HANDLE_REWARD_FORM_TYPE, NOTIFICATION_TYPE, REWARD_FORM_SUBMIT_MESSAGE } from '../../constants'
import {rewardActions} from "../../store/Reward/slice";
import {useState} from "react";
import {useAppDispatch} from "../../store/hooks";


const RewardForm = ({id, rewards}: { id: number, rewards: any }) => {
    const dispatch = useAppDispatch();
    const [rewardTitle, setRewardTitle] = useState(rewards.title);
    const [rewardDescription, setRewardDescription] = useState(rewards.description);
    const [rewardMinimumContribution, setRewardMinimumContribution] = useState(rewards.minimumContribution);
    const [rewardStockLimit, setRewardStockLimit] = useState(rewards.stockLimit);
    const [isStockLimited, setIsStockLimited] = useState(false);

    const stockLimitedClickHandler = (stockIsLimited: boolean) => {
        setIsStockLimited(stockIsLimited);
    };

    const confirmRewardHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isStockLimited === null) {
            dispatch(
                notificationActions.setNotification({
                    message:
                        'Please indicate if there is an inventory limit for this reward!',
                    type: NOTIFICATION_TYPE.ALERT,
                })
            );
        } else {
            const title = rewardTitle;
            const description = rewardDescription;
            const minimumContribution = rewardMinimumContribution;
            let stockLimit;
            if (!isStockLimited) {
                stockLimit = 0;
            } else {
                stockLimit = rewardStockLimit as number;
            }
            if (title === '') {
                dispatch(
                    notificationActions.setNotification({
                        message: 'Please enter a title for your reward!',
                        type: NOTIFICATION_TYPE.ALERT,
                    })
                );
            } else if (description === '') {
                dispatch(
                    notificationActions.setNotification({
                        message: 'Please enter a description for your reward!',
                        type: NOTIFICATION_TYPE.ALERT,
                    })
                );
            }  else if (minimumContribution < 5) {
                dispatch(
                    notificationActions.setNotification({
                        message: 'Please enter a minimumContribution higher than 5!',
                        type: NOTIFICATION_TYPE.ALERT,
                    })
                );
            } else if (isStockLimited && (stockLimit === 0 || stockLimit === undefined)) {
                dispatch(
                    notificationActions.setNotification({
                        message: 'Please enter an inventory reward greater than 0!',
                        type: NOTIFICATION_TYPE.ALERT,
                    })
                );
            } else {
                dispatch(
                    rewardActions.addReward({
                        id,
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


    return (
        <form onSubmit={confirmRewardHandler}>
            <div className='card-body'>
            <h5 className='card-title'>Reward {id + 1}</h5>
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
                />
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
                        type="button"
                        className='btn btn-primary me-3'
                        onClick={() => stockLimitedClickHandler(true)}
                    >
                        Yes
                    </button>
                    <button
                        type="button"
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
            <button type='submit' className='btn btn-primary'>
              Validate
            </button>
            </div>
        </form>
    );
}

export default RewardForm;
