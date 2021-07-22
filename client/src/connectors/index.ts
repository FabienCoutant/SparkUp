import { InjectedConnector } from '@web3-react/injected-connector';
import { SupportedChainId } from '../constants/chains';
import { NetworkConnector } from '@web3-react/network-connector';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
let DEFAULT_NETWORK_CHAINID = process.env.REACT_APP_DEFAULT_NETWORK_CHAINID as number | undefined;

if(typeof DEFAULT_NETWORK_CHAINID ==="undefined"){
  DEFAULT_NETWORK_CHAINID = 3;
}

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
  defaultChainId: DEFAULT_NETWORK_CHAINID,
});

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_IDS,
});
