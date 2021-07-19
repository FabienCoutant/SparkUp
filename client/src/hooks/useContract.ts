import { useMemo } from 'react';
import { getContract } from '../utils/web3React';
import { useWeb3React } from '@web3-react/core';
import USDC from '../contracts/external/USDC.json';
import CampaignFactory from '../contracts/CampaignFactory.json';

export const useContractUSDC = () => {
  const { library, chainId } = useWeb3React();
  return useMemo(() => {
    if (!library || !chainId) return null;
    try {
      return getContract(USDC, library, chainId, 'USDC');
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [chainId, library]);
};

export const useContractCampaignFactory = () => {
  const { library, chainId } = useWeb3React();
  return useMemo(() => {
    if (!library || !chainId) return null;
    try {
      return getContract(CampaignFactory, library, chainId, 'LOCAL');
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [chainId, library]);
};

// export const useContractCampaign = (address: string) => {
//   const { library, chainId } = useWeb3React();
//   return useMemo(() => {
//     if (!library || !chainId) return null;
//     try {
//       return getTestContract(Campaign, library, address);
//     } catch (error) {
//       console.error('Failed to get contract', error);
//       return null;
//     }
//   }, [chainId, library, address]);
// };
