const CampaignFactory = artifacts.require('CampaignFactory');
const CampaignCreator = artifacts.require('CampaignCreator');
const TestUSDC = artifacts.require('TestUSDC');
const Escrow = artifacts.require('Escrow');
const USDC_CONTRACTS = {
  mainnet: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  'ropsten-fork': '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  ropsten: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
};

module.exports = async (deployer, network, accounts) => {
  let addressUSDC;
  if (network === 'development' || network === 'soliditycoverage' || network === 'coverage') {
    await deployer.deploy(TestUSDC, accounts[1]);
    const TUSDC = await TestUSDC.deployed();
    addressUSDC = TUSDC.address;
  } else {
    addressUSDC = USDC_CONTRACTS[network];
  }
  await deployer.deploy(Escrow, addressUSDC);
  const EscrowInstance = await Escrow.deployed();

  await deployer.deploy(CampaignFactory);
  const CampaignFactoryInstance = await CampaignFactory.deployed();

  await deployer.deploy(CampaignCreator, CampaignFactoryInstance.address, EscrowInstance.address, addressUSDC);
  const CampaignCreatorInstance = await CampaignCreator.deployed();

  await CampaignFactoryInstance.setCampaignCreator(CampaignCreatorInstance.address);
};

