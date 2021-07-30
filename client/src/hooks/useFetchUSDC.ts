import {  useContractUSDC } from './useContract'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { serializeUSDCFor } from '../utils/serializeValue'


export const useFetchUserAllowance = (address: string) => {
  const { library, chainId, account } = useWeb3React()
  const contractUSDC = useContractUSDC();
  const [allowanceAmount,setAllowanceAmount] = useState(0);
  useEffect(() => {
      const fetchUSDC = async () => {
        if (contractUSDC && chainId && library) {
          const amount = await contractUSDC?.methods?.allowance(account,address).call()
          setAllowanceAmount(serializeUSDCFor(amount,false) as number);
        }
      }
      fetchUSDC()
    }, [contractUSDC, chainId, library, account,address]
  )
  return allowanceAmount
}
