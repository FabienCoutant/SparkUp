import { useAppSelector } from '../../../store/hooks';
import { Info } from '../../../constants/index';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { getCampaignInfo } from '../../../utils/web3React';
import { useContractCampaign } from '../../../hooks/useContract';
import { useLocation } from 'react-router';

const Campaign = (props: { address: string | null }) => {
  const campaign = useAppSelector((state) => state.campaign);
  const contractCampaign = useContractCampaign(props.address);
  const [campaignInfo, setCampaignInfo] = useState<Info>();
  const { pathname } = useLocation();
  const [isManager, setIsManager] = useState(false);
  const { library, account } = useWeb3React();
  useEffect(() => {
    if (library && props.address) {
      const getCampaign = async () => {
        const _campaignInfo: Info = await getCampaignInfo(
          props.address!,
          library
        );
        setCampaignInfo(_campaignInfo);
      };
      getCampaign();
    }
  }, [library, props.address]);

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
  console.log(campaignInfo);
  return (
    <div className='card mb-3 mt-3'>
      <div className='card-body'>
        <h5 className='card-title text-center' id='campaignTitle'>
          {campaignInfo ? campaignInfo.title : campaign.title}
        </h5>
        <p className='card-text mt-5' id='campaingDescription'>
          {campaignInfo ? campaignInfo.description : campaign.description}
        </p>
        <h6 className='card-subtitle mb-2' id='campaignFundingGoal'>
          Funding Goal :{' '}
          {campaignInfo ? campaignInfo.fundingGoal : campaign.fundingGoal} USDC
        </h6>
        <h6
          className='card-subtitle mb-2 list-inline-item'
          id='campaignDeadline'
        >
<<<<<<< HEAD
          Campaign Ends On : 31/12/2021
=======
          Campaign Ends On :{' '}
          {campaignInfo
            ? campaignInfo.durationDays && new Date(campaignInfo.durationDays).toLocaleDateString()
            : campaign.durationDays &&
              new Date(campaign.durationDays).toLocaleDateString()}
>>>>>>> e5f3026d1d39f277fd4afa3edebadcf0e6e6bfa0
        </h6>
        <div className='mt-3'>
          {campaignInfo && pathname !== `/campaign-details/${props.address}` && (
            <Link
              to={`/campaign-details/${props.address}`}
              style={{ textDecoration: 'none', color: 'white' }}
            >
              <button type='button' className='btn btn-primary gap-2'>
                More
              </button>
            </Link>
          )}
          {pathname === `/campaign-details/:${props.address}` && (
            <div className='progress mt-5 mb-5'>
              <div
                className='progress-bar progress-bar-striped progress-bar-animated'
                role='progressbar'
                aria-valuenow={75}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ width: '75%' }}
              ></div>
            </div>
          )}
          {isManager && pathname === `/campaign-details/:${props.address}` && (
            <button type='button' className='btn btn-primary'>
              Modify Campaign
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Campaign;
