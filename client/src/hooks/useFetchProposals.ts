import { useActiveWeb3React } from './useWeb3'
import { useContractProposal } from './useContract'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { serializeUSDCFor } from '../utils/serializeValue'
import { proposal, proposalActions } from '../store/Proposal/slice'
import { serializeTimestampsFor } from '../utils/dateHelper'
import { useWeb3React } from '@web3-react/core'

export const useFetchProposalsList = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractProposal = useContractProposal(address)
  const activeProposals: proposal[] = []
  const archivedProposals: proposal[] = []
  useEffect(() => {
    const fetchProposals = async () => {
      if (contractProposal && chainId && library) {
        const activeProposalCounter = await contractProposal?.methods?.activeProposalCounter().call()
        for (let i = 0; i < activeProposalCounter; i++) {
          const res = await contractProposal?.methods?.activeProposals(i).call()
          const activeProposal = {
            title: res.title,
            description: res.description,
            accepted:res.accepted,
            amount: serializeUSDCFor(res.amount, false),
            okVotes: serializeUSDCFor(res.okVotes,false) as number,
            nokVotes: serializeUSDCFor(res.nokVotes,false) as number,
            deadLine: serializeTimestampsFor(res.deadLine, false),
            status: parseInt(res.status),
            onChain: true
          }
          activeProposals.push(activeProposal)
        }
        dispatch(proposalActions.setActiveProposalState({ active: activeProposals }))
        const archivedProposalCounter = await contractProposal?.methods?.archivedProposalCounter().call()
        for (let i = 0; i < archivedProposalCounter; i++) {
          const res = await contractProposal?.methods?.archivedProposals(i).call()
          const archivedProposal = {
            title: res.title,
            description: res.description,
            accepted:res.accepted,
            amount: serializeUSDCFor(res.amount, false),
            okVotes: serializeUSDCFor(res.okVotes,false) as number,
            nokVotes: serializeUSDCFor(res.nokVotes,false) as number,
            deadLine: serializeTimestampsFor(res.deadLine, false),
            status: parseInt(res.status),
            onChain: true
          }
          archivedProposals.push(archivedProposal)
        }
        dispatch(proposalActions.setArchivedProposalState({ archived: archivedProposals }))
        const availableFunds = await contractProposal?.methods?.availableFunds().call()
        dispatch(proposalActions.setAvailableFunds({ availableFunds: serializeUSDCFor(availableFunds, false) }))
      }

    }
    fetchProposals()
  }, [contractProposal, chainId, library, address, dispatch])
}

export const useHasVoted = (id: number, address: string ) => {
  const { library, chainId, account } = useWeb3React()
  const contractProposal = useContractProposal(address)
  const [hasVoted, setHasVoted] = useState(false)
  useEffect(() => {
    const fetchHasVoted = async () => {
      if (contractProposal && chainId && library) {
        const res = await contractProposal?.methods?.hasVoted(id,account).call()
        setHasVoted(res)
      }
    }
    fetchHasVoted()
  }, [library, chainId, contractProposal, account])
  return hasVoted
}
