export enum NOTIFICATION_TYPE {
  NONE,
  ALERT,
  ERROR,
  SUCCESS
}

export const USDC_CONTRACTS: { [key: string]: string } = {
  '1': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '3': '0x07865c6e87b9f70255377e024ace6630c1eaa37f'
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export enum WORKFLOW_STATUS {
  CampaignDrafted,
  CampaignPublished,
  FundingComplete,
  FundingFailed,
  CampaignCompleted,
  CampaignDeleted
}

export enum PROPOSAL_WORKFLOW_STATUS {
  Pending,
  Registered,
  VotingSessionStarted,
  VotingSessionEnded,
  VotesTallied,
}

export enum VOTING_TYPE {
  OK,
  NOK
}

export interface campaignState {
  info: Info,
  createAt: number
  manager: string
  onChain: boolean,
  confirmed: boolean,
  amountRaise: number | string,
  currentBalance: number | string,
  workflowStatus: WORKFLOW_STATUS,
  proposalAddress: string
}

export interface Info {
  title: string;
  description: string;
  fundingGoal: number | string;
  deadlineDate: number;
}

export interface Rewards {
  title: string;
  description: string;
  minimumContribution: number | string;
  amount: number | string;
  stockLimit: number;
  nbContributors: number;
  isStockLimited: boolean;
}

export interface Proposals {
  title: string;
  description: string;
  amount: number | string;
  okVotes: number;
  nokVotes: number;
  status: PROPOSAL_WORKFLOW_STATUS;
  deadLine: number;
  accepted: boolean;
}

export enum RENDER_TYPE {
  LIST,
  ADD,
  DETAIL,
  CREATE,
  UPDATE,
  DELETE
}


export const RENDER_MESSAGE: { [key in RENDER_TYPE]: string } = {
  [RENDER_TYPE.LIST]: 'See More',
  [RENDER_TYPE.DETAIL]: 'See More',
  [RENDER_TYPE.ADD]: 'Validate and add',
  [RENDER_TYPE.CREATE]: 'Validate',
  [RENDER_TYPE.UPDATE]: 'Validate and update',
  [RENDER_TYPE.DELETE]: 'Delete'
}
