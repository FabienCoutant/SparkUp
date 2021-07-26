import Web3 from 'web3'
import { USDC_CONTRACTS } from '../constants'

export const getLibrary = (provider: any) => {
  return new Web3(provider)
}

export const getContractByABI = (
  contractJSON: any,
  library: any,
  chainId: number,
  type: string
) => {
  if (!contractJSON) {
    return
  }
  let contract
  if (type === 'USDC') {
    contract = new library.eth.Contract(contractJSON, USDC_CONTRACTS[chainId])
  }
  if (type === 'LOCAL') {
    const deployedNetwork = contractJSON.networks[chainId]
    contract = new library.eth.Contract(
      contractJSON.abi,
      deployedNetwork && deployedNetwork.address
    )
  }

  return contract
}

export const getContractByAddress = (
  contractJSON: any,
  library: any,
  address: string
) => {
  if (!contractJSON) {
    return
  }
  return new library.eth.Contract(contractJSON.abi, address)
}
