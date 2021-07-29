import { useEffect, useState } from 'react'
import { useActiveWeb3React } from './useWeb3'
import { useContractCampaign, useContractCampaignFactory } from './useContract'
import { useWeb3React } from '@web3-react/core'
import { useAppDispatch } from '../store/hooks'
import { serializeCampaignInfo } from '../utils/serializeCampaignInfo'
import { campaignActions, initialState } from '../store/Campaign/slice'
import { serializeTimestampsFor } from '../utils/dateHelper'
import { campaignState } from '../constants'
import { serializeValueTo } from '../utils/serializeValue'


export const useFetchCampaignAddress = (): string[] => {
  const { library, chainId } = useActiveWeb3React()
  const contractCampaignFactory = useContractCampaignFactory()
  const [campaignAddress, setCampaignAddress] = useState([])

  useEffect(() => {
    const fetchCampaignsAddress = async () => {
      if (contractCampaignFactory && chainId && library) {
        const res = await contractCampaignFactory.methods
          .getDeployedCampaignsList()
          .call()
        setCampaignAddress(res)
      }
    }
    fetchCampaignsAddress()

  }, [contractCampaignFactory, chainId, library])
  return campaignAddress
}

export const useIsManager = (campaignManager:string): boolean => {
  const { account } = useWeb3React()
  return campaignManager === account
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
            const _amountRaise = await contractCampaign?.methods?.getContractUSDCBalance().call()
            setCampaignInfo({
              info: serializeCampaignInfo(res[0]),
              createAt: serializeTimestampsFor(res[1], false),
              manager: res[2],
              workflowStatus: parseInt(res[3]),
              amountRaise: serializeValueTo(_amountRaise,false),
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


export const useFetchCampaignInfoAndDispatch=(address:string)=>{
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useAppDispatch()
  const contractCampaign = useContractCampaign(address)
  useEffect(() => {
      const fetchCampaign = async () => {
        if (contractCampaign && chainId && library) {
          const res = await contractCampaign?.methods?.getCampaignInfo().call()
          const _amountRaise = await contractCampaign?.methods?.getContractUSDCBalance().call()
          dispatch(campaignActions.setCampaign({
            info: serializeCampaignInfo(res[0]),
            createAt: serializeTimestampsFor(res[1], false),
            manager: res[2],
            workflowStatus: parseInt(res[3]),
            amountRaise: serializeValueTo(_amountRaise,false),
            onChain: true,
            confirmed: true
          }))
        }
      }
      fetchCampaign()
    }, [contractCampaign, chainId, library, dispatch]
  )
}
