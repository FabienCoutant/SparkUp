import { NOTIFICATION_TYPE, PROPOSAL_TYPE, PROPOSAL_WORKFLOW_STATUS, STATE_PROPOSAL_TYPE } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useIsContributor, useIsManager } from '../../hooks/useFetchCampaign'
import { useParams } from 'react-router-dom'
import { useHasVoted } from '../../hooks/useFetchProposals'
import { useContractProposal } from '../../hooks/useContract'
import { useEffect, useState } from 'react'
import { notificationActions } from '../../store/Notification/slice'
import { proposal, proposalActions } from '../../store/Proposal/slice'
import { serializeUSDCFor } from '../../utils/serializeValue'
import { userActions } from '../../store/User/slice'


const ProposalCard = ({ id, proposalType }: { id: number, proposalType: PROPOSAL_TYPE }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const campaign = useAppSelector((state) => state.campaign)
  // @ts-ignore
  const proposals = useAppSelector((state) => state.proposal[STATE_PROPOSAL_TYPE[proposalType]])
  const contractProposal = useContractProposal(campaign.proposalAddress)
  const fetchHasVoted = useHasVoted(proposals[id].id, campaign.proposalAddress)
  const isManager = useIsManager(campaign.manager)
  const { isContributor, contributorBalance } = useIsContributor(campaignAddress)
  const [hasVoted, setHasVoted] = useState(false)

  useEffect(() => {
    setHasVoted(fetchHasVoted)
  }, [fetchHasVoted])

  const handleVoteProposal = (isApprove: boolean) => {
    if (contractProposal && isContributor && !hasVoted) {
      contractProposal.methods.voteProposal(proposals[id].id, isApprove).send({ from: account }).then(() => {
        setHasVoted(true)
        let proposalUpdated: proposal = { ...proposals[id] }
        if (isApprove) {
          proposalUpdated = {
            ...proposalUpdated,
            okVotes: proposalUpdated.okVotes + serializeUSDCFor(contributorBalance, false)
          }
        } else {
          proposalUpdated = {
            ...proposalUpdated,
            nokVotes: proposalUpdated.nokVotes + serializeUSDCFor(contributorBalance, false)
          }
        }
        dispatch(proposalActions.updateProposal({
          active: proposalUpdated,
          id
        }))
        dispatch(notificationActions.setNotification({
          message: 'Your vote has been successfully registered',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => console.log(error))
    }
  }

  const handlePublishProposal = () => {
    if (contractProposal && isManager) {
      contractProposal.methods.startVotingSession(proposals[id].id).send({ from: account }).then(() => {
        const proposalUpdated: proposal = { ...proposals[id], status: PROPOSAL_WORKFLOW_STATUS.VotingSessionStarted }
        dispatch(notificationActions.setNotification({
          message: 'Your proposal is now publish for 7 days',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
        dispatch(proposalActions.updateProposal({
          active: proposalUpdated,
          id
        }))
      }).catch((error: any) => console.log(error))
    }
  }

  const handleDeleteProposal = () => {
    if (contractProposal && isManager) {
      contractProposal.methods.deleteProposal(proposals[id].id).send({ from: account }).then(() => {
        dispatch(proposalActions.removeProposal({
          id
        }))
        dispatch(notificationActions.setNotification({
          message: 'Your proposal has been successfully deleted',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => console.log(error))
    }
  }

  const handleGetResultProposal = () => {
    if (contractProposal) {
      contractProposal.methods.getResults(proposals[id].id).send({ from: account }).then(() => {
        if (isManager) {
          dispatch(userActions.addBalance({ balance: proposals[id].amount }))
        }
        dispatch(proposalActions.moveActiveToArchived({
          id
        }))
        dispatch(notificationActions.setNotification({
          message: 'The proposal has been closed',
          type: NOTIFICATION_TYPE.SUCCESS
        }))
      }).catch((error: any) => console.log(error))
    }
  }

  const renderProposalButton = () => {
    if (proposalType === PROPOSAL_TYPE.ACTIVE) {
      if (isContributor && !hasVoted && proposals[id].status === PROPOSAL_WORKFLOW_STATUS.VotingSessionStarted) {
        return (
          <div className='row'>
            <div className='col-4'>
              <button type='button' className='btn btn-success' onClick={() => handleVoteProposal(true)}>
                APPROVE
              </button>
            </div>
            <div className='col-4'>
              <button type='button' className='btn btn-danger' onClick={() => handleVoteProposal(false)}>
                REFUSE
              </button>
            </div>
          </div>
        )
      }
      if (isManager && proposals[id].status === PROPOSAL_WORKFLOW_STATUS.Registered) {
        return (
          <div className='row'>
            <div className='col-4'>
              <button type='button' className='btn btn-success' onClick={() => handlePublishProposal()}>
                Publish
              </button>
            </div>
            <div className='col-4'>
              <button type='button' className='btn btn-danger' onClick={() => handleDeleteProposal()}>
                Delete
              </button>
            </div>
          </div>
        )
      }
      if (proposals[id].status === PROPOSAL_WORKFLOW_STATUS.VotingSessionStarted
        && new Date().getTime >= proposals[id].deadLine //Disabled for local test
      ) {
        return (
          <div className='col-4'>
            <button type='button' className='btn btn-success' onClick={() => handleGetResultProposal()}>
              Get Result
            </button>
          </div>
        )
      }
    }
  }

  if (proposals[id].status === PROPOSAL_WORKFLOW_STATUS.Registered && !isManager) {
    return <></>
  }
  return (
    <div className='card mb-3 mt-3'>
      <div className='card text-start'>
        <div
          className={`card-body ${proposalType === PROPOSAL_TYPE.ARCHIVED ? proposals[id].accepted ? 'bg-success' : 'bg-danger' : ''}`}>
          <h5 className='card-title text-center'> {proposals[id].title}</h5>
          <div className='list-inline'>
            <label htmlFor='rewardDescription' className='form-label'>
              Description :
            </label>
            <p className='card-text' id='rewardDescription'>
              {proposals[id].description}
            </p>
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='rewardMinimumContribution'
              >
                Amount requested to withdraw (USDC) :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='rewardMiniumContribution'
              >
                {proposals[id].amount} USDC
              </h6>
            </div>
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='okVotes'
              >
                Number of OK :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='okVotes'
              >
                {proposals[id].okVotes}
              </h6>
            </div>
            <div className='list-inline'>
              <label
                className='form-label list-inline-item'
                htmlFor='NokVotes'
              >
                Number of NOK :
              </label>
              <h6
                className='card-subtitle mb-2 list-inline-item'
                id='NokVotes'
              >
                {proposals[id].nokVotes}
              </h6>
            </div>
            {renderProposalButton()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProposalCard
