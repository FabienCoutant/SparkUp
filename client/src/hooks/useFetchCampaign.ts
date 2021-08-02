import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './useWeb3'
import { useContractCampaign, useContractCampaignFactory } from './useContract'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from '../store/hooks'
import { serializeCampaignInfo } from '../utils/serializeCampaignInfo'
import { campaignActions, initialState } from '../store/Campaign/slice'
import { serializeTimestampsFor } from '../utils/dateHelper'
import { campaignState, ZERO_ADDRESS } from '../constants'
import { serializeUSDCFor } from '../utils/serializeValue'


export const useFetchCampaignAddress = (): string[] => {
  const { library, chainId } = useActiveWeb3React()
  const contractCampaignFactory = useContractCampaignFactory()
  const [campaignList,setCampaignList]=useState<string[]>([])

  useEffect(() => {
    const fetchCampaignsAddress = async () => {
      if (contractCampaignFactory && chainId && library) {
        setCampaignList([])
        const campaignCounter = await contractCampaignFactory.methods.campaignCounter().call()
        for (let i = 1; i < campaignCounter; i++) {
          const address = await contractCampaignFactory.methods.deployedCampaigns(i).call()
          setCampaignList(campaignList=>[...campaignList,address])
        }
      }
    }
    fetchCampaignsAddress()

  }, [contractCampaignFactory, chainId, library])
  return campaignList
}

export const useIsManager = (campaignManager: string): boolean => {
  const { account } = useWeb3React()
  return campaignManager === account
}

export const useIsContributor = (address: string): { isContributor:boolean,contributorBalance:number } => {
  const { account, library, chainId } = useWeb3React()
  const contractCampaign = useContractCampaign(address)
  const [isContributor, setIsContributor] = useState(false)
  const [contributorBalance, setContributorBalance] = useState(0)
  useEffect(() => {
    const fetchContributorBalance = async () => {
      if (contractCampaign && chainId && library) {
        const balance: number = await contractCampaign.methods.contributorBalances(account).call()
        if (balance > 0) {
          setContributorBalance(balance)
          setIsContributor(true)
        }
      }
    }
    fetchContributorBalance()
  }, [account, library, chainId, contractCampaign])
  return { isContributor,contributorBalance }
}

export const useFetchCampaignInfo = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractCampaign = useContractCampaign(address)
  const [campaignInfo, setCampaignInfo] = useState<campaignState>(initialState)
  useEffect(() => {
      const fetchCampaign = async () => {
        if (contractCampaign && chainId && library) {
          const res = await contractCampaign?.methods?.getCampaignInfo().call()
          const balance = await contractCampaign?.methods?.getContractUSDCBalance().call()
          if (res[5] === ZERO_ADDRESS) {
            res[4] = balance
          }
          setCampaignInfo({
            info: serializeCampaignInfo(res[0]),
            createAt: serializeTimestampsFor(res[1], false),
            manager: res[2],
            workflowStatus: parseInt(res[3]),
            amountRaise: serializeUSDCFor(res[4], false),
            currentBalance: serializeUSDCFor(balance, false),
            proposalAddress:res[5],
            onChain: true,
            confirmed: true
          })
        }
      }
      fetchCampaign()
    }, [contractCampaign, chainId, library, dispatch]
  )
  return campaignInfo
}


export const useFetchCampaignInfoAndDispatch = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractCampaign = useContractCampaign(address)
  useEffect(() => {
      const fetchCampaign = async () => {
        if (contractCampaign && chainId && library) {
          const res = await contractCampaign?.methods?.getCampaignInfo().call()
          const balance = await contractCampaign?.methods?.getContractUSDCBalance().call()
          if (res[5] === ZERO_ADDRESS) {
            res[4] = balance
          }
          dispatch(campaignActions.setCampaign({
            info: serializeCampaignInfo(res[0]),
            createAt: serializeTimestampsFor(res[1], false),
            manager: res[2],
            workflowStatus: parseInt(res[3]),
            amountRaise: serializeUSDCFor(res[4], false),
            proposalAddress:res[5],
            currentBalance: serializeUSDCFor(balance, false),
            onChain: true,
            confirmed: true
          }))
        }
      }
      fetchCampaign()
    }, [contractCampaign, chainId, library, dispatch]
  )
}
