import { InjectedConnector } from '@web3-react/injected-connector';
import { SupportedChainId } from '../constants/chains';
import { NetworkConnector } from '@web3-react/network-connector';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;

if (typeof INFURA_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`
  );
}

const NETWORK_URLS = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GANACHE]: `http://localhost:7545/`,
};

const SUPPORTED_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.GANACHE,
];

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: 1337,
});

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});
