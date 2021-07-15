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
      <h1 className='mt-2 mb-5 text-center'>Campaign Summuary</h1>
      <CreateCampaign showNextButton={false} />
      {rewards.map((reward: reward) => {
        return <Reward id={reward.id} key={reward.id} />;
      })}
      <button className='btn btn-primary mb-3' onClick={submitCampaignHandler}>
        Submit Campaign
      </button>
    </>
  );
};

export default ConfirmCampaing;
