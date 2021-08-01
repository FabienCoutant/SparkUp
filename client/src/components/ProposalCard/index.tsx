import { PROPOSAL_TYPE, PROPOSAL_WORKFLOW_STATUS, RENDER_TYPE, STATE_PROPOSAL_TYPE } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useIsContributor, useIsManager } from '../../hooks/useFetchCampaign'
import { useParams } from 'react-router-dom'
import { useHasVoted } from '../../hooks/useFetchProposals'
import { useContractProposal } from '../../hooks/useContract'
import { useEffect, useState } from 'react'


const ProposalCard = ({ id,proposalType }: { id: number,proposalType:PROPOSAL_TYPE}) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const campaign = useAppSelector((state) => state.campaign)
  // @ts-ignore
  const proposals = useAppSelector((state) => state.proposal[STATE_PROPOSAL_TYPE[proposalType]])
  const contractProposal = useContractProposal(campaign.proposalAddress)
  const fetchHasVoted = useHasVoted(id,campaign.proposalAddress)
  const isManager = useIsManager(campaign.manager)
  const isContributor = useIsContributor(campaignAddress)
  const [hasVoted,setHasVoted] = useState(false)

  useEffect(()=>{
    setHasVoted(fetchHasVoted)
  },[fetchHasVoted])

  const handleVoteProposal=(isApprove:boolean)=> {
    if (contractProposal && isContributor && !hasVoted) {
      contractProposal.methods.voteProposal(id,isApprove).send({account}).then(()=>{
          setHasVoted(true)
      }).catch((error:any)=>console.log(error))
    }
  }

  const renderProposalButton = () =>{
    if(isContributor && !hasVoted &&proposals.status===PROPOSAL_WORKFLOW_STATUS.VotingSessionStarted){
      return(
        <div className='row'>
        <div className="col-4">
          <button type='button' className='btn btn-success' onClick={()=>handleVoteProposal(true)}>
            APPROVE
          </button>
        </div>
        <div className="col-4">
          <button type='button' className='btn btn-danger' onClick={()=>handleVoteProposal(false)}>
            REFUSE
          </button>
        </div>
        </div>
      )
    }
    return(
      <div>Test</div>
    );
  }

  return(
    <div className='card text-start'>
      <div className='card-body'>
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
            Amount requested to withdraw  (USDC) :
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
  )
}

export default ProposalCard;
