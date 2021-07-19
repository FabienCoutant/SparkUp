// import { AbstractConnector } from '@web3-react/abstract-connector';
// import { injected } from '../utils/web3React';
// import INJECTED_ICON_URL from '../assets/images/arrow-right.svg';
// import METAMASK_ICON_URL from '../assets/images/metamask.png';

// interface WalletInfo {
//   connector?: AbstractConnector;
//   name: string;
//   iconURL: string;
//   description: string;
//   href: string | null;
//   color: string;
//   primary?: true;
//   mobile?: true;
//   mobileOnly?: true;
// }

// export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
//   INJECTED: {
//     connector: injected,
//     name: 'Injected',
//     iconURL: INJECTED_ICON_URL,
//     description: 'Injected web3 provider.',
//     href: null,
//     color: '#010101',
//     primary: true,
//   },
//   METAMASK: {
//     connector: injected,
//     name: 'MetaMask',
//     iconURL: METAMASK_ICON_URL,
//     description: 'Easy-to-use browser extension.',
//     href: null,
//     color: '#E8831D',
//   },
// };

export const USDC_CONTRACTS: { [key: string]: string } = {
  '1': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '3': '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
};

export interface Info {
  title: string;
  description: string;
  fundingGoal: number;
  durationDays: number | Date;
}

export interface Rewards {
  title: string;
  description: string;
  minimumContribution: number;
  amount: number;
  stockLimit: number;
  nbContributors: number;
  isStockLimited: boolean;
}
