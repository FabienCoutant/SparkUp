import Web3 from 'web3'

export const serializeUSDCFor=(value:number|string,isTargetSolidity:boolean)=>{
  if(isTargetSolidity){
    return Web3.utils.toWei(value.toString(),"ether");
  }else{
    return parseInt(Web3.utils.fromWei(Web3.utils.toBN(value),"ether"));
  }
}
