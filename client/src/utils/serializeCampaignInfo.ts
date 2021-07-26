import { campaignState } from '../store/Campaign/slice'
import { Info } from '../constants'
import { serializeTimestampsFor } from './dateHelper'


export const serializeCampaignInfo = (campaignData: campaignState): Info => {
  return {
    title: campaignData.title,
    description: campaignData.description,
    fundingGoal: campaignData.fundingGoal,
    deadlineDate: serializeTimestampsFor(campaignData.deadlineDate,true)
  }
}

