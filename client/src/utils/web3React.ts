import Web3 from 'web3';
import { USDC_CONTRACTS } from '../constants';

export const getLibrary = (provider: any) => {
  return new Web3(provider);
};

export const getContract = (
  contractJSON: any,
  library: Web3,
  chainId: number,
  type: string
) => {
  if (!contractJSON) {
    return;
  }
  let contract;
  if (type === 'USDC') {
    contract = new library.eth.Contract(
      contractJSON,
      USDC_CONTRACTS[chainId.toString()]
    );
  }
  if (type === 'LOCAL') {
    const deployedNetwork = contractJSON.networks[chainId.toString()];
    contract = new library.eth.Contract(
      contractJSON.abi,
      deployedNetwork && deployedNetwork.address
    );
  }

  return contract;
};
