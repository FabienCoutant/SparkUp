
export enum NOTIFICATION_TYPE{
  NONE,
  ALERT,
  ERROR
}

export const USDC_CONTRACTS: { [key: string]: string } = {
  '1': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '3': '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
};


enum WorkflowStatus{
  CampaignDrafted,
  CampaignPublished,
  FundingComplete,
  FundingFailed,
  CampaignCompleted,
  CampaignDeleted
}

export interface CampaignInfo{
  info : Info,
  createAt:number
  manager: string
  publish:boolean,
  confirmed:boolean,
  workflowStatus: WorkflowStatus
}

export interface Info {
  title: string;
  description: string;
  fundingGoal: number;
  deadlineDate: number;
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

export enum HANDLE_REWARD_FORM_TYPE{
  NONE ,
  INIT,
  LIST,
  ADD,
  UPDATE_NOT_YET_CONFIRMED,
  UPDATE_CONFIRMED,
  DELETE,
}

export const REWARD_FORM_SUBMIT_MESSAGE : {[key in HANDLE_REWARD_FORM_TYPE]:string }={
  [HANDLE_REWARD_FORM_TYPE.NONE] : "Submit",
  [HANDLE_REWARD_FORM_TYPE.INIT] : "Validate and confirm reward",
  [HANDLE_REWARD_FORM_TYPE.LIST] : "Validate and confirm reward",
  [HANDLE_REWARD_FORM_TYPE.ADD] : "Validate and add new reward",
  [HANDLE_REWARD_FORM_TYPE.UPDATE_NOT_YET_CONFIRMED] : "Validate and confirm update reward",
  [HANDLE_REWARD_FORM_TYPE.UPDATE_CONFIRMED] : "Validate and confirm update reward",
  [HANDLE_REWARD_FORM_TYPE.DELETE] : "Confirm reward deletion"
}

export enum HANDLE_CAMPAIGN_FORM_TYPE{
  NONE,
  LIST,
  DETAILS,
  CREATE,
  UPDATE,
  DELETE
}

export const INFO_FORM_SUBMIT_MESSAGE : {[key in HANDLE_CAMPAIGN_FORM_TYPE]:string }={
  [HANDLE_CAMPAIGN_FORM_TYPE.NONE] : "Submit",
  [HANDLE_CAMPAIGN_FORM_TYPE.LIST] : "See More",
  [HANDLE_CAMPAIGN_FORM_TYPE.DETAILS] : "Submit",
  [HANDLE_CAMPAIGN_FORM_TYPE.CREATE] : "Validate campaign's info",
  [HANDLE_CAMPAIGN_FORM_TYPE.UPDATE] : "Validate and confirm update's info",
  [HANDLE_CAMPAIGN_FORM_TYPE.DELETE] : "Confirm campaign deletion"
}

export enum RENDER_TYPE{
  LIST,
  DETAIL,
  CREATE,
  UPDATE,
  DELETE
}


export const RENDER_MESSAGE : {[key in RENDER_TYPE]:string }={
  [RENDER_TYPE.LIST] : "See More",
  [RENDER_TYPE.DETAIL] : "See More",
  [RENDER_TYPE.CREATE] : "Validate campaign's info",
  [RENDER_TYPE.UPDATE] : "Validate and confirm update's info",
  [RENDER_TYPE.DELETE] : "Confirm campaign deletion"
}
