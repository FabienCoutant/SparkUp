import { Info } from '../constants'
import { serializeTimestampsFor } from './dateHelper'
import { serializeUSDCFor } from './serializeValue'


export const serializeCampaignInfo = (campaignData: Info): Info => {
  return {
    title: campaignData.title,
    description: campaignData.description,
    fundingGoal: serializeUSDCFor(campaignData.fundingGoal,false),
    deadlineDate: serializeTimestampsFor(campaignData.deadlineDate,false)
  }
}

