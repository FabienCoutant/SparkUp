import { useActiveWeb3React } from './useWeb3'
import { useContractProposal } from './useContract'
import { useEffect } from 'react'
import { useAppDispatch } from '../store/hooks'
import { serializeUSDCFor } from '../utils/serializeValue'
import { proposal, proposalActions } from '../store/Proposal/slice'
import { serializeTimestampsFor } from '../utils/dateHelper'

export const useFetchProposalsList = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractProposal = useContractProposal(address)
  const proposals:proposal[] = []
  useEffect(() => {
    const fetchProposals = async () => {
      if (contractProposal && chainId && library) {
        const proposalCounter = await contractProposal?.methods?.proposalCounter().call()
        for (let i = 0; i < proposalCounter; i++) {
          const res = await contractProposal?.methods?.proposals(i).call()
          const proposal = {
            title:res.title,
            description:res.description,
            amount: serializeUSDCFor(res.amount,false),
            okVotes:res.okVotes,
            nokVotes:res.nokVotes,
            deadLine:serializeTimestampsFor(res.deadLine,false),
            status:parseInt(res.status),
            accepted : res.accepted,
            onChain: true,
            confirmed: true
          }
          proposals.push(proposal);
        }
        dispatch(proposalActions.setState({ proposals } ))
      }
    }
    fetchProposals()
  }, [contractProposal, chainId, library, address,dispatch]);
}
