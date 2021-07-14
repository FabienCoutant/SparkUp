export enum SupportedChainId {
  MAINNET = 1,
  ROPSTEN = 3,
  GANACHE = 1337,
}

export type SupportedL1ChainId =
  | SupportedChainId.MAINNET
  | SupportedChainId.ROPSTEN
  | SupportedChainId.GANACHE;

export const NETWORK_LABELS: {
  [chainId in SupportedChainId | number]: string;
} = {
  [SupportedChainId.MAINNET]: 'Mainnet',
  [SupportedChainId.ROPSTEN]: 'Ropsten',
  [SupportedChainId.GANACHE]: 'Ganache',
} as const;

export const L1_CHAIN_IDS = [
  SupportedChainId.MAINNET,
  SupportedChainId.ROPSTEN,
  SupportedChainId.GANACHE,
];

interface L1ChainInfo {
  explorer: string;
  label: string;
}

type ChainInfo = { [chainId in SupportedL1ChainId]: L1ChainInfo };

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.MAINNET]: {
    explorer: 'https://etherscan.io/',
    label: NETWORK_LABELS[SupportedChainId.MAINNET],
  },
  [SupportedChainId.ROPSTEN]: {
    explorer: 'https://ropsten.etherscan.io/',
    label: NETWORK_LABELS[SupportedChainId.ROPSTEN],
  },
  [SupportedChainId.GANACHE]: {
    explorer: '',
    label: NETWORK_LABELS[SupportedChainId.GANACHE],
  },
};
