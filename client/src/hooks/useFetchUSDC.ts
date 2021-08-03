import {  useContractUSDC } from './useContract'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { serializeUSDCFor } from '../utils/serializeValue'
import { useDispatch } from 'react-redux'
import { userActions } from '../store/User/slice'


export const useFetchUserAllowance = (address: string) => {
  const { library, chainId, account } = useWeb3React()
  const contractUSDC = useContractUSDC();
  const [allowanceAmount,setAllowanceAmount] = useState(0);
  useEffect(() => {
      const fetchUSDC = async () => {
        if (contractUSDC && chainId && library) {
          const amount = await contractUSDC?.methods?.allowance(account,address).call()
          setAllowanceAmount(serializeUSDCFor(amount,false));
        }
      }
      fetchUSDC()
    }, [contractUSDC, chainId, library, account,address]
  )
  return allowanceAmount
}

export const useFetchUserBalance = () => {
  const dispatch = useDispatch();
  const { library, chainId, account } = useWeb3React()
  const contractUSDC = useContractUSDC();
  useEffect(() => {
      const fetchUSDCBalance = async () => {
        if (contractUSDC && chainId && library) {
          const amount = await contractUSDC?.methods?.balanceOf(account).call()
          console.log(typeof amount)
          const balance = serializeUSDCFor(amount,false);
          dispatch(userActions.setBalance({balance}))
        }
      }
    fetchUSDCBalance()
    }, [contractUSDC, chainId, library, account, dispatch]
  )
}
