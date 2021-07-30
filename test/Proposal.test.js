const { expectRevert, time, BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignContract = artifacts.require('Campaign');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const ProposalContract = artifacts.require('Proposal');
const TestUSDCContract = artifacts.require('TestUSDC.sol');

contract('Proposal', (accounts) => {
  const [alice, bob] = accounts;
  const initialCampaignInfo = {
    title: 'First Campaign',
    description: 'This is the first campaign of SparkUp',
    fundingGoal: ether('11000').toString(),
    deadlineDate: 0,
  };
  const initialRewards = [
    {
      title: 'First rewards',
      description: 'level1',
      minimumContribution: ether('100').toString(),
      stockLimit: 0,
      nbContributors: 0,
      amount: 0,
      isStockLimited: false,
    },
    {
      title: 'Second rewards',
      description: 'level2',
      minimumContribution: ether('5').toString(),
      stockLimit: 1000,
      nbContributors: 0,
      amount: 0,
      isStockLimited: true,
    },
  ];

  const proposal = {
    title: 'First Proposal',
    description: 'This is the first proposal',
    amount: ether('1500').toString(),
  };

  let CampaignFactoryContractInstance;
  let CampaignContractInstance;
  let ProposalContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(bob, { from: bob });
    CampaignFactoryContractInstance = await CampaignFactoryContract.new(TestUSDCContractInstance.address, {
      from: alice,
    });
    const deadline = parseInt((await time.latest()).add(time.duration.days(8)));
    initialCampaignInfo.deadlineDate = deadline;
    const newCampaign = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {
      from: alice,
    });
    newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
    CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    await CampaignContractInstance.publishCampaign({
      from: alice,
    });
    const spender = CampaignContractInstance.address;
    const bobContribution = ether('11000').toString();
    TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
      from: bob,
    });
    await CampaignContractInstance.contribute(bobContribution, 0, {
      from: bob,
    });
    await CampaignContractInstance.launchProposalContract({ from: alice });
    const proposalContractAddress = await CampaignContractInstance.proposal();
    console.log(proposalContractAddress);
    ProposalContractInstance = await ProposalContract.at(proposalContractAddress);
  });
  describe('--- Create Proposal ---', async () => {
    it('should allow manager to create proposal on correct workflow', async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
    });
  });
});
