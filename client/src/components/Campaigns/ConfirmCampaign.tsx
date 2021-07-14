import { useAppSelector } from '../../store/hooks';
import Campaign from './Campaign';
import CreateCampaign from './CreateCampaign';
import CreateRewards from './CreateRewards';

const ConfirmCampaing = () => {
  const campaign = useAppSelector((state) => state.campaign);
  console.log(campaign);
  const rewards = useAppSelector((state) => state.reward);

  return (
    <>
      <CreateCampaign />
      <CreateRewards />
    </>
  );
};

export default ConfirmCampaing;
