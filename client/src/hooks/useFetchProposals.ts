import { useActiveWeb3React } from './useWeb3'
import { useContractProposal } from './useContract'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { serializeUSDCFor } from '../utils/serializeValue'
import { proposalActions } from '../store/Proposal/slice'
import { serializeTimestampsFor } from '../utils/dateHelper'
import { useWeb3React } from '@web3-react/core'
import { PROPOSAL_TYPE } from '../constants'

export const useFetchProposalsList = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractProposal = useContractProposal(address)
  useEffect(() => {
    const fetchProposals = async () => {
      if (contractProposal && chainId && library) {
        const nbProposal = await contractProposal?.methods?.proposalCounter().call()
        if (nbProposal > 0) {
          const activeProposalsList = await contractProposal?.methods?.getProposals(PROPOSAL_TYPE.ACTIVE).call()
          for (let i = 0; i < activeProposalsList.length; i++) {
            const activeProposal = {
              id: parseInt(activeProposalsList[i].id),
              title: activeProposalsList[i].title,
              description: activeProposalsList[i].description,
              accepted: activeProposalsList[i].accepted,
              amount: serializeUSDCFor(activeProposalsList[i].amount, false) as number,
              okVotes: serializeUSDCFor(activeProposalsList[i].okVotes, false) as number,
              nokVotes: serializeUSDCFor(activeProposalsList[i].nokVotes, false) as number,
              deadLine: serializeTimestampsFor(activeProposalsList[i].deadline, false),
              status: parseInt(activeProposalsList[i].status),
              onChain: true
            }
            dispatch(proposalActions.addActiveProposal({ active: activeProposal }))
          }
          const archivedProposalsList = await contractProposal?.methods?.getProposals(PROPOSAL_TYPE.ARCHIVED).call()
          console.log(archivedProposalsList)
          for (let i = 0; i < archivedProposalsList.length; i++) {
            const archivedProposal = {
              id: parseInt(archivedProposalsList[i].id),
              title: archivedProposalsList[i].title,
              description: archivedProposalsList[i].description,
              accepted: archivedProposalsList[i].accepted,
              amount: serializeUSDCFor(archivedProposalsList[i].amount, false) as number,
              okVotes: serializeUSDCFor(archivedProposalsList[i].okVotes, false) as number,
              nokVotes: serializeUSDCFor(archivedProposalsList[i].nokVotes, false) as number,
              deadLine: serializeTimestampsFor(archivedProposalsList[i].deadline, false),
              status: parseInt(archivedProposalsList[i].status),
              onChain: true
            }
            dispatch(proposalActions.addArchivedProposal({ archived: archivedProposal }))
          }
        }
        const availableFunds = await contractProposal?.methods?.availableFunds().call()
        dispatch(proposalActions.setAvailableFunds({ availableFunds: serializeUSDCFor(availableFunds, false) }))
      }
    }
    fetchProposals()
  }, [contractProposal, chainId, library, dispatch])
}

export const useHasVoted = (id: number, address: string) => {
  const { library, chainId, account } = useWeb3React()
  const contractProposal = useContractProposal(address)
  const [hasVoted, setHasVoted] = useState(false)
  useEffect(() => {
    const fetchHasVoted = async () => {
      if (contractProposal && chainId && library) {
        const res = await contractProposal?.methods?.hasVoted(id, account).call()
        setHasVoted(res)
      }
    }
    fetchHasVoted()
  }, [library, chainId, contractProposal, account, id])
  return hasVoted
}
