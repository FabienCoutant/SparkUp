import { useFetchCampaignAddress } from '../../hooks/useFetchCampaign'
import CampaignCard from '../../components/CampaignCard'
import { useShowLoader } from '../../hooks/useShowLoader'
import Loader from '../../components/Loader'

const Dashboard = () => {
  const campaignAddress = useFetchCampaignAddress();
  const showLoader = useShowLoader()
  const renderCampaignList = () => {
    if (campaignAddress.length > 0) {
      return campaignAddress.map((address) => (
        <CampaignCard
          key={address}
          address={address}
        />
      ))
    } else {
      return `No campaigns available`
    }
  }
  if(showLoader){
    return <Loader/>
  }
  return (
    <div className='mt-5'>
      <h1 className='mt-3 text-center'>Campaigns list</h1>
      <div className="row row-cols-2">
        {renderCampaignList()}
      </div>
    </div>
  )
}

export default Dashboard
