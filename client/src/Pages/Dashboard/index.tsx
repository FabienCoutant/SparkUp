import { useFetchCampaignAddress, useFetchCampaignsListData } from '../../hooks/useFetchCampaign'
import { RENDER_TYPE } from '../../constants'
import CampaignCard from '../../components/CampaignCard'

const Dashboard = () => {
  const campaignAddress = useFetchCampaignAddress()

  const campaignsList = useFetchCampaignsListData(campaignAddress);

  const renderCampaignList = () => {
    if (campaignAddress.length > 0) {
      return campaignAddress.map((campaign, index) => (
        <CampaignCard
          key={campaign}
          address={campaignAddress[index]}
        />
      ))
    } else {
      return `No campaigns available`
    }
  }

  return (
    <div className='mt-5'>
      <h1 className='mt-3 text-center'>Campaigns list</h1>
      {renderCampaignList()}
    </div>
  )
}

export default Dashboard
