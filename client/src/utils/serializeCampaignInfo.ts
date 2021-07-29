import { Info } from '../constants'
import { serializeTimestampsFor } from './dateHelper'
import { serializeValueTo } from './serializeValue'


export const serializeCampaignInfo = (campaignData: Info): Info => {
  return {
    title: campaignData.title,
    description: campaignData.description,
    fundingGoal: serializeValueTo(campaignData.fundingGoal,false),
    deadlineDate: serializeTimestampsFor(campaignData.deadlineDate,false)
  }
}

