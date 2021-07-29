import Web3 from 'web3'

export const serializeValueTo=(value:number|string,isToSolidity:boolean)=>{
  if(isToSolidity){
    return Web3.utils.toWei(value.toString(),"ether");
  }else{
    return parseInt(Web3.utils.fromWei(Web3.utils.toBN(value),"ether"));
  }
}
