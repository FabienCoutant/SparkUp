import { useMemo } from 'react'
import { getContractByABI, getContractByAddress } from '../utils/web3React'
import { useWeb3React } from '@web3-react/core'
import { useActiveWeb3React } from './useWeb3'
import USDC from '../contracts/external/USDC.json'
import TUSDC from '../contracts/internal/TestUSDC.json'
import CampaignFactory from '../contracts/internal/CampaignFactory.json'
import Campaign from '../contracts/internal/Campaign.json'
import Proposal from '../contracts/internal/Proposal.json'
import CampaignCreator from '../contracts/internal/CampaignCreator.json'
import { ZERO_ADDRESS } from '../constants'

export const useContractUSDC = () => {
  const { library, chainId } = useWeb3React()
  return useMemo(() => {
    if (!library || !chainId) return null
    try {
      if (chainId === 1 || chainId === 3) {
        return getContractByABI(USDC, library, chainId, 'USDC')
      } else if (chainId === 1337) {
        return getContractByABI(TUSDC, library, chainId, 'USDC')
      }
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, library])
}

export const useContractCampaignFactory = () => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!library || !chainId) return null
    try {
      return getContractByABI(CampaignFactory, library, chainId, 'LOCAL')
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, library])
}

export const useContractCampaign = (address: string | null) => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!address) {
      return null
    }
    if (!library || !chainId) return null
    try {
      return getContractByAddress(Campaign, library, address)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, library, address])
}


export const useContractProposal = (address: string | null) => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!address || address === ZERO_ADDRESS) {
      return null
    }
    if (!library || !chainId) return null
    try {
      return getContractByAddress(Proposal, library, address)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, library, address])
}


export const useContractCampaignCreator = () => {
  const { library, chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!library || !chainId) return null
    try {
      return getContractByABI(CampaignCreator, library, chainId, 'LOCAL')
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [chainId, library])
}
