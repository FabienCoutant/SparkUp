import { RENDER_TYPE } from '../../constants'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useWeb3React } from '@web3-react/core'
import { useIsContributor, useIsManager } from '../../hooks/useFetchCampaign'
import { useParams } from 'react-router-dom'


const ProposalCard = ({ id, renderType }: { id: number, renderType: RENDER_TYPE }) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const campaign = useAppSelector((state) => state.campaign)
  const proposals = useAppSelector((state) => state.proposal.proposals)

  const isManager = useIsManager(campaign.manager)
  const isContributor = useIsContributor(campaignAddress)

  const renderProposalButton = () =>{
    return(
      <div>Test</div>
    );
  }


  return(
    <div className='card'>
      <div className='card-body'>
        <h5 className='card-title'> {proposals[id].title}</h5>
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
