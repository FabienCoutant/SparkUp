import Web3 from 'web3';
import { USDC_CONTRACTS } from '../constants';
import { Info, Rewards } from '../constants/index';
import CampaignJSON from '../contracts/Campaign.json';

export const getLibrary = (provider: any) => {
  return new Web3(provider);
};

export const getContract = (
  contractJSON: any,
  library: any,
  chainId: number,
  type: string
) => {
  if (!contractJSON) {
    return;
  }
  let contract;
  if (type === 'USDC') {
    contract = new library.eth.Contract(contractJSON, USDC_CONTRACTS[chainId]);
  }
  if (type === 'LOCAL') {
    const deployedNetwork = contractJSON.networks[chainId];
    contract = new library.eth.Contract(
      contractJSON.abi,
      deployedNetwork && deployedNetwork.address
    );
  }

  return contract;
};

export const getTestContract = (
  contractJSON: any,
  library: Web3,
  address: string
) => {
  if (!contractJSON) {
    return;
  }
  let contract;
  contract = new library.eth.Contract(contractJSON.abi, address);

  return contract;
};

export const getCampaignInfo = async (address: string, library: Web3) => {
  let campaignInfo: Info = {
    title: "",
    description: "",
    fundingGoal: 10000,
    durationDays: new Date().setDate(Date.now()+7),
  };
  try {
    const contract = getTestContract(CampaignJSON, library, address);
    campaignInfo = await contract?.methods.campaignInfo().call();
    const creationDate = await contract?.methods.createAt().call();
    const deadline = creationDate * 1000;
    campaignInfo.durationDays = deadline;
  } catch (error) {
    console.error('Failed to get contract', error);
  }
  return campaignInfo;
};

export const getRewardsList = async (contract: any) => {
  const rewards: Rewards[] = [];
  if (contract) {
    const rewardCounter = await contract.methods.rewardsCounter().call();
    for (let i = 0; i < rewardCounter; i++) {
      const reward = await contract.methods.rewardsList(i).call();
      rewards.push(reward);
    }
  }
  return rewards;
};

export const isValidDate = (date: Date, createAt:Date) => {
  if (Object.prototype.toString.call(date) === 'Invalid Date') {
    return false;
  }
  return date.getTime() > new Date(createAt).setDate(createAt.getDate()+7);
};
