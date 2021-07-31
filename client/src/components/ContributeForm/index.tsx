import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { useParams } from 'react-router'
import { useContractCampaign, useContractUSDC } from '../../hooks/useContract'
import { useState } from 'react'
import { useFetchUserAllowance } from '../../hooks/useFetchUSDC'
import { notificationActions } from '../../store/Notification/slice'
import { NOTIFICATION_TYPE } from '../../constants'
import { serializeUSDCFor } from '../../utils/serializeValue'
import { rewardActions } from '../../store/Reward/slice'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'


const ContributeForm = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch()
  const {account} = useWeb3React()
  const rewards = useAppSelector(state => state.reward.rewards)
  const { campaignAddress } = useParams<{ campaignAddress: string }>()
  const contractCampaign = useContractCampaign(campaignAddress)
  const contractUSDC = useContractUSDC()
  const allowanceAmount = useFetchUserAllowance(campaignAddress)
  const [amountApproved,setAmountApproved] = useState(0);
  const [contributionAmount, setContributionAmount] = useState(rewards[id].minimumContribution)
  const [showContribution, setShowContribution] = useState(false)

  useEffect(()=>{
    setAmountApproved(allowanceAmount)
  },[allowanceAmount])
  const handleContribution = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if(contributionAmount<rewards[id].minimumContribution){
      dispatch(
        notificationActions.setNotification({
          message:
            'Your contribution must be at least equal to the minimum required',
          type: NOTIFICATION_TYPE.ALERT
        })
      )
    }
    if(amountApproved>= contributionAmount){
      contractCampaign?.methods?.contribute(serializeUSDCFor(contributionAmount,true),id).send({from:account})
        .then(()=>{
          dispatch(rewardActions.addContribution({amount:contributionAmount as number,id}))
          dispatch(notificationActions.setNotification(({
            message: `Contribution succeed`,
            type:NOTIFICATION_TYPE.SUCCESS
          })))
        }).catch((error:any)=>console.log(error))
    }else{
      const amount = serializeUSDCFor(contributionAmount,true)
      contractUSDC?.methods?.increaseAllowance(campaignAddress,amount).send({from:account})
        .then(()=>{
          setAmountApproved(amount as number)
          dispatch(notificationActions.setNotification(({
            message: `Approved succeed`,
            type:NOTIFICATION_TYPE.SUCCESS
          })))
        }).catch((error:any)=>console.log(error))
    }
  }


  const renderContributeButton = () => {
    if (allowanceAmount>=contributionAmount) {
      return (
        <button type='submit' className='btn btn-success'>Contribute</button>
      )
    } else {
      return (
        <button type='submit' className='btn btn-success'>Approve</button>
      )
    }
  }

  const renderForm = () => {
    if( rewards[id].isStockLimited && (rewards[id].stockLimit - rewards[id].nbContributors)===0){
      return(
        <>
          They no more stock available for this rewards
        </>
      )
    }
    if (showContribution) {
      return (
        <form onSubmit={handleContribution}>
          <div className='mt-2 row align-items-end justify-content-center'>
            <div className='col-6'>
              <label htmlFor='rewardMinimumContribution' className='form-label'>
                Your contribution
              </label>
              <input
                type='number'
                className='form-control'
                id='rewardMinimumContribution'
                value={contributionAmount}
                onChange={(e) => setContributionAmount(parseInt(e.target.value))}
              />
            </div>
            <div className='col-3'>
              {renderContributeButton()}
            </div>
            <div className='col-3'>
              <button type='submit' className='btn btn-secondary' onClick={() => setShowContribution(false)}>Cancel
              </button>
            </div>
          </div>
        </form>
      )
    } else {
      return (
        <div className='text-center mt-2'>
          <button type='submit' className='btn btn-success' onClick={() => setShowContribution(true)}>
            I want to contribute
          </button>
        </div>
      )
    }
  }
  return (
    <div>
      {renderForm()}
    </div>
  )
}

export default ContributeForm