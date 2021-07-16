import Web3 from 'web3';
import { USDC_CONTRACTS } from '../constants';

export const getLibrary = (provider: any) => {
  return new Web3(provider);
};

export const getContract = (
  contractABI: any,
  library: Web3,
  chainId: number
) => {
  if (!contractABI) {
    return;
  }
  const contract = new library.eth.Contract(
    contractABI,
    USDC_CONTRACTS[chainId.toString()]
  );

  return contract;
};
