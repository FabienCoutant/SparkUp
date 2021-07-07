import Web3 from 'web3';
import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 1337],
});

export const getLibrary = (provider: any) => {
  return new Web3(provider);
};
