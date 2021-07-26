import { useMemo } from 'react'
import { useActiveWeb3React } from './useWeb3'
import { useContractCampaign, useContractCampaignFactory } from './useContract'
import { useWeb3React } from '@web3-react/core'
import { useAppSelector } from '../store/hooks'
import { serializeCampaignInfo } from '../utils/serializeCampaignInfo'
import { CampaignInfo } from '../constants'


export const useFetchCampaignAddress = (): string[] => {
  const { library, chainId } = useActiveWeb3React()
  const contractCampaignFactory = useContractCampaignFactory()
  let campaignAddress: string[] = []
  return useMemo(() => {
    if (contractCampaignFactory && chainId && library) {
      try {
        campaignAddress = contractCampaignFactory.methods
          .getDeployedCampaignsList()
          .call()

      } catch (e) {
        console.log(e)
      }
    }
    return campaignAddress
  }, [contractCampaignFactory, chainId, library])
}

export const useIsManager = (): boolean => {
  const { account } = useWeb3React()
  const campaign = useAppSelector((state) => state.campaign)
  return campaign?.manager === account
}

export const useFetchCampaignInfo = (address: string) => {
  const { library, chainId } = useActiveWeb3React()
  const contractCampaign = useContractCampaign(address)
  let campaign: CampaignInfo

  return useMemo(() => {
    if (contractCampaign && chainId && library) {
      try {
        const res = contractCampaign.methods
          .getCampaignInfo()
          .call()
        campaign.info = serializeCampaignInfo(res['0'])
        campaign.createAt = res['1']
        campaign.manager = res['2']
      } catch (e) {
        console.log(e)
      }
    }
    return campaign
  }, [contractCampaign, chainId, library])
}

export const useFetchCampaignsListData = (campaignsAddress: string[]) => {
  const { library, account, chainId } = useActiveWeb3React()
  const campaignsData:CampaignInfo[] = []

  useMemo(() => {
    if (chainId && library) {
      campaignsAddress.map((address) => {
        const campaignInstance = useContractCampaign(address)
        const campaignInfo = useFetchCampaignInfo(campaignInstance)
        campaignsData.push(campaignInfo)
      })
    }
  }, [campaignsAddress, library, account, chainId])
  return campaignsData

}


