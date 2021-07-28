const CampaignFactory = artifacts.require('CampaignFactory');
const TestUSDC = artifacts.require('TestUSDC');
const USDC_CONTRACTS = {
  mainnet: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  ropsten: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
};

module.exports = async (deployer, _network, accounts) => {
  let addressUSDC;
  if (_network === 'development') {
    await deployer.deploy(TestUSDC, accounts[1]);
    const TUSDC = await TestUSDC.deployed();
    addressUSDC = TUSDC.address;
  } else {
    addressUSDC = USDC_CONTRACTS._network;
  }
  deployer.deploy(CampaignFactory, addressUSDC);
};
