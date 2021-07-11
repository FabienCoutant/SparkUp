import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';
import { USDC_CONTRACTS } from '../constants';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 1337, 5777, 3],
});

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
