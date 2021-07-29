import Web3 from 'web3'

export const serializeValueTo=(value:number,isToSolidity:boolean)=>{
  if(isToSolidity){
    return Web3.utils.toWei(Web3.utils.toBN(value),"ether").toNumber();
  }else{
    return parseInt(Web3.utils.fromWei(Web3.utils.toBN(value),"ether"));
  }
}
