import { Info } from '../constants'
import { serializeTimestampsFor } from './dateHelper'


export const serializeCampaignInfo = (campaignData: Info): Info => {
  return {
    title: campaignData.title,
    description: campaignData.description,
    fundingGoal: parseInt(campaignData.fundingGoal.toString()),
    deadlineDate: serializeTimestampsFor(campaignData.deadlineDate,false)
  }
}

