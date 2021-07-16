import { useAppSelector } from '../../store/hooks';
import CreateCampaign from './CreateCampaign';
import Reward from './Reward';
import { reward } from '../../store/reward-slice';

const ConfirmCampaing = () => {
  const campaign = useAppSelector((state) => state.campaign);
  console.log(campaign);
  const rewards = useAppSelector((state) => state.reward.rewards);

  const submitCampaignHandler = () => {};

  return (
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
  );
};

export default ConfirmCampaing;
