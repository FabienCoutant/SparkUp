
module.exports = async()=> {
  const block = await web3.eth.getBlock("latest");
  const currentTime=block.timestamp;
  console.log(new Date(currentTime*1000))
  await advanceBlockAtTime(currentTime+86400*10)
  const blockFuture = await web3.eth.getBlock("latest");
  console.log(new Date(blockFuture.timestamp*1000))
}

const advanceBlockAtTime = (time) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send(
      {
        jsonrpc: "2.0",
        method: "evm_mine",
        params: [time],
        id: new Date().getTime(),
      },
      (err, _) => {
        if (err) {
          return reject(err);
        }
        const newBlockHash = web3.eth.getBlock("latest").hash;

        return resolve(newBlockHash);
      },
    );
  });
};
