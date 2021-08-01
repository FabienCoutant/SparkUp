import { useHistory, useParams } from 'react-router-dom'
import { useFetchRewardsList } from '../../hooks/useFetchRewards'
import RewardCard from '../../components/RewardCard'
import CampaignCard from '../../components/CampaignCard'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import Loader from '../../components/Loader'
import { NOTIFICATION_TYPE, RENDER_TYPE, WORKFLOW_STATUS, ZERO_ADDRESS } from '../../constants'
import CampaignForm from '../../components/CampaignForm'
import { reward, rewardActions } from '../../store/Reward/slice'
import RewardForm from '../../components/RewardForm'
import { useFetchCampaignInfoAndDispatch, useIsContributor, useIsManager } from '../../hooks/useFetchCampaign'
import { useContractCampaign } from '../../hooks/useContract'
import { useActiveWeb3React } from '../../hooks/useWeb3'
import { useShowLoader } from '../../hooks/useShowLoader'
import { Redirect } from 'react-router'
import { campaignActions } from '../../store/Campaign/slice'
import { notificationActions } from '../../store/Notification/slice'
import { userActions } from '../../store/User/slice'
import { useFetchProposalsList } from '../../hooks/useFetchProposals'
import { proposal } from '../../store/Proposal/slice'
import ProposalCard from '../../components/ProposalCard'

const CampaignDetails = () => {
  const { account } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  useFetchCampaignInfoAndDispatch(campaignAddress)
  useFetchRewardsList(campaignAddress)
  const contractCampaign = useContractCampaign(campaignAddress)
  const campaign = useAppSelector(state => state.campaign)
  const rewards = useAppSelector(state => state.reward.rewards)
  const proposals = useAppSelector(state => state.proposal.proposals)
  useFetchProposalsList(campaign.proposalAddress)
  const isManager = useIsManager(campaign.manager)
  const { isContributor, contributorBalance } = useIsContributor(campaignAddress)
  const showLoader = useShowLoader()

  const addNewReward = () => {
    dispatch(
      rewardActions.addReward(
        {
          reward: {
            title: '',
            description: '',
            minimumContribution: 0,
            amount: 0,
            stockLimit: 0,
            nbContributors: 0,
            isStockLimited: false,
            onChain: false,
            confirmed: false
          }
        })
    )
  }

  const publishCampaign = () => {
    if (contractCampaign) {
      contractCampaign.methods.publishCampaign().send({ from: account }).then(() => {
        dispatch(campaignActions.setWorkflow({ workflowStatus: WORKFLOW_STATUS.CampaignPublished }))
        dispatch(notificationActions.setNotification({
          message: 'Your Campaign is now publish for contribution',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }
  const deleteCampaign = () => {
    if (contractCampaign) {
      contractCampaign.methods.deleteCampaign().send({ from: account })
        .then(() => {
          history.push({ pathname: '/' })
        }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  const handleContributorRefund = () => {
    if (contractCampaign) {
      contractCampaign.methods.refund().send({ from: account }).then(() => {
        dispatch(userActions.addBalance({ balance: contributorBalance }))
        dispatch(notificationActions.setNotification({
          message: 'Your has been successfully refund',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  const handleLaunchProposal =()=>{
    if (contractCampaign && isManager) {
      contractCampaign.methods.launchProposalContract().send({ from: account }).then(() => {
        contractCampaign.methods.proposal().call().then((res:any)=>{
          console.log(res)
        })
        dispatch(notificationActions.setNotification({
          message: 'Your has been successfully launch the proposal part',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => {
        console.log(error)
      })
    }
  }

  const renderManagerAction = () => {
    if (isManager && campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted) {
      return (
        <div className='list-inline mt-3'>
          <div className='list-inline-item'>
            <button type='button' className='btn btn-success' onClick={publishCampaign}>
              Publish Campaign
            </button>
          </div>
          <div className='list-inline-item'>
            <button type='button' className='btn btn-danger' onClick={deleteCampaign}>
              Delete Campaign
            </button>
          </div>
        </div>
      )
    }
    if (isContributor
      && (
        (campaign.workflowStatus === WORKFLOW_STATUS.CampaignPublished
        && campaign.amountRaise <= campaign.info.fundingGoal
        //&& campaign.info.deadlineDate<= new Date().getTime()
        )
        || campaign.workflowStatus === WORKFLOW_STATUS.FundingFailed
      )
    ) {
      return (
        <div>
          <button type='button' className='btn btn-info' onClick={handleContributorRefund}>
            Get Refund
          </button>
        </div>
      )
    }
    if(isManager
    && campaign.workflowStatus === WORKFLOW_STATUS.FundingComplete
      //&& campaign.info.deadlineDate <= new Date().getTime()
    ){
      return (
        <div>
          <button type='button' className='btn btn-info' onClick={handleLaunchProposal}>
            Start Proposals
          </button>
        </div>
      )
    }
  }

  const renderCampaign = () => {
    if (campaign.confirmed) {
      return <CampaignCard address={''} />
    } else {
      return <CampaignForm renderType={RENDER_TYPE.UPDATE} />
    }
  }

  const renderReward = (reward: reward, index: number) => {
    if (reward.confirmed) {
      return <RewardCard id={index} renderType={RENDER_TYPE.UPDATE} />
    } else {
      if (reward.onChain) {
        return <RewardForm id={index} reward={reward} renderType={RENDER_TYPE.UPDATE} />
      } else {
        return <RewardForm id={index} reward={reward} renderType={RENDER_TYPE.ADD} />
      }
    }
  }

  const renderProposal = (proposal:proposal,index:number) => {
    if(proposal.confirmed){
      return <ProposalCard id={index} renderType={RENDER_TYPE.DETAIL}/>
    }
  }
  console.log(campaign.proposalAddress)
  const renderAddRewardButton = () => {
    if (isManager && campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted) {
      return (
        <div className='mb-3 mt-3 text-center'>
          <button className='btn btn-primary' onClick={addNewReward}>
            Add Reward
          </button>
        </div>
      )
    }
  }

  if (showLoader) {
    return <Loader />
  }
  if ((!isManager && campaign.workflowStatus === WORKFLOW_STATUS.CampaignDrafted) || campaign.workflowStatus === WORKFLOW_STATUS.CampaignDeleted) {
    return <Redirect to='/' />
  }
  return (
    <>
      <div className='text-center mt-3'>
        <h1>Campaign Details </h1>
      </div>
      <div className='row'>
        {renderManagerAction()}
        <div className='mb-5'>
          {renderCampaign()}
        </div>
      </div>
      <div className='row row-cols-2'>
        <div className='col-5'>
          <div className='text-center'>
            <h2>Rewards Level</h2>
          </div>

          {
            rewards.map((reward, index) => {
                return (
                  <div className='card mb-3 mt-3' key={index}>
                    {renderReward(reward, index)}
                  </div>
                )
              }
            )
          }
          {renderAddRewardButton()}
        </div>
        <div className='col-7'>
          <div className='text-center'>
            <h2>Proposals</h2>
            {campaign.proposalAddress!==ZERO_ADDRESS &&
              proposals.map((proposal, index) => {
                  return (
                    <div className='card mb-3 mt-3' key={index}>
                      {renderProposal(proposal, index)}
                    </div>
                  )
                }
              )
            }
          </div>
        </div>
      </div>

    </>
  )
}


export default CampaignDetails
