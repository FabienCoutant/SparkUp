const { expectRevert, time, BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignContract = artifacts.require('Campaign');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const ProposalContract = artifacts.require('Proposal');
const TestUSDCContract = artifacts.require('TestUSDC.sol');
const EscrowContract = artifacts.require('Escrow');

contract('Proposal', (accounts) => {
  const [alice, bob, john, greg] = accounts;
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
  let EscrowContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(bob, { from: bob });
    EscrowContractInstance = await EscrowContract.new(TestUSDCContractInstance.address, { from: alice });
    CampaignFactoryContractInstance = await CampaignFactoryContract.new(
      TestUSDCContractInstance.address,
      EscrowContractInstance.address,
      {
        from: alice,
      }
    );
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
    await TestUSDCContractInstance.transfer(john, ether('2000').toString(), { from: bob });
    const bobContribution = ether('9000').toString();
    const johnContribution = ether('2000').toString();
    TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
      from: bob,
    });
    TestUSDCContractInstance.increaseAllowance(spender, johnContribution, {
      from: john,
    });
    await CampaignContractInstance.contribute(bobContribution, 0, {
      from: bob,
    });
    await CampaignContractInstance.contribute(johnContribution, 0, {
      from: john,
    });
    await time.increase(time.duration.days(15));
    await CampaignContractInstance.launchProposalContract({ from: alice });
    const proposalContractAddress = await CampaignContractInstance.proposal();
    ProposalContractInstance = await ProposalContract.at(proposalContractAddress);
    const campaignManager = await ProposalContractInstance.campaignManager();
    expect(campaignManager).to.be.equal(alice);
  });

  describe('--- Create Proposal ---', async () => {
    it('should allow manager to create proposal on correct workflow', async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      const proposalCounter = await ProposalContractInstance.proposalCounter();
      expect(proposalCounter).to.be.bignumber.equal(new BN(1));
      const newProposal = await ProposalContractInstance.proposals(0);
      expect(newProposal.title).to.be.equal(proposal.title);
      expect(newProposal.description).to.be.equal(proposal.description);
      expect(newProposal.amount).to.be.bignumber.equal(new BN(proposal.amount));
      expect(newProposal.status).to.be.bignumber.equal(new BN(1));
    });
    it('should revert if title is empty', async () => {
      await expectRevert(
        ProposalContractInstance.createProposal('', proposal.description, proposal.amount, {
          from: alice,
        }),
        '!Err: Title empty'
      );
    });
    it('should revert if description is empty', async () => {
      await expectRevert(
        ProposalContractInstance.createProposal(proposal.title, '', proposal.amount, {
          from: alice,
        }),
        '!Err: Description empty'
      );
    });
    it('should revert if amount is less than 100 USDC', async () => {
      await expectRevert(
        ProposalContractInstance.createProposal(proposal.title, proposal.description, ether('99').toString(), {
          from: alice,
        }),
        '!Err: Amount too low'
      );
    });
    it('should revert if amount more than campaign balance', async () => {
      await expectRevert(
        ProposalContractInstance.createProposal(proposal.title, proposal.description, ether('11001').toString(), {
          from: alice,
        }),
        '!Err: Proposal amount exceeds campaign USDC balance'
      );
    });
    it('should revert if already 5 proposals created', async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await expectRevert(
        ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
          from: alice,
        }),
        '!Err: Maximum amount of proposal reached'
      );
    });
    it('should revert if called by other than campaign manager', async () => {
      await expectRevert(
        ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
          from: bob,
        }),
        '!Err: not manager'
      );
    });
  });

  describe('--- Delete Propsosal ---', async () => {
    it('should allow campaignManager to delete proposal if workflow status is Registered', async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.deleteProposal(0, { from: alice });
      const deletedProposal = await ProposalContractInstance.proposals(0);
      expect(deletedProposal.title).to.be.equal('');
    });
    it('should revert if wrong workflow status', async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      const registeredProposal = await ProposalContractInstance.proposals(0);
      const proposalStatus = registeredProposal.status;
      expect(proposalStatus).to.be.bignumber.equal(new BN(2));
      await expectRevert(ProposalContractInstance.deleteProposal(0, { from: alice }), '!Err : Wrong workflow status');
    });
  });

  describe('--- Vote ---', async () => {
    beforeEach(async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
    });
    it('should allow contributor to vote', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, true, { from: bob });
      await ProposalContractInstance.voteProposal(0, false, { from: john });
      const registeredProposal = await ProposalContractInstance.proposals(0);
      const okVotes = registeredProposal.okVotes;
      const bobCampaignBalance = await CampaignContractInstance.contributorBalances(bob);
      const johnCampaignBalance = await CampaignContractInstance.contributorBalances(john);
      expect(okVotes).to.be.bignumber.equal(bobCampaignBalance);
      const nokVotes = registeredProposal.nokVotes;
      expect(nokVotes).to.be.bignumber.equal(johnCampaignBalance);
      const bobHasVoted = await ProposalContractInstance.hasVoted(bob);
      expect(bobHasVoted).to.be.true;
      const johnHasVoted = await ProposalContractInstance.hasVoted(john);
      expect(johnHasVoted).to.be.true;
    });
    it('should revert if wrong workflow status', async () => {
      await expectRevert(ProposalContractInstance.voteProposal(0, true, { from: bob }), '!Err : Wrong workflow status');
    });
    it('should revert if proposal deadline is passed', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await time.increase(time.duration.days(10));
      await expectRevert(
        ProposalContractInstance.voteProposal(0, true, { from: bob }),
        '!Err: proposal voting has ended'
      );
    });
    it('should revert if contributor has already votes', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, true, { from: bob });
      await expectRevert(ProposalContractInstance.voteProposal(0, true, { from: bob }), '!Err: Already voted');
    });
    it('should rever it not contributor', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await expectRevert(ProposalContractInstance.voteProposal(0, true, { from: greg }), '!Err: not a contributor');
    });
  });

  describe('--- Get Results ---', async () => {
    beforeEach(async () => {
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
    });
    it('should allow manager or contributor to get correct proposal voting results if proposal accepted', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, true, { from: bob });
      await ProposalContractInstance.voteProposal(0, false, { from: john });
      await time.increase(time.duration.days(10));
      await ProposalContractInstance.getResults(0, { from: alice });
      const votedProposal = await ProposalContractInstance.proposals(0);
      const proposalResult = votedProposal.accepted;
      expect(proposalResult).to.be.true;
      const proposalStatus = votedProposal.status;
      expect(proposalStatus).to.be.bignumber.equal(new BN(4));
    });
    it('should allow manager or contributor to get correct proposal voting results if proposal rejected', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, false, { from: bob });
      await ProposalContractInstance.voteProposal(0, true, { from: john });
      await time.increase(time.duration.days(10));
      await ProposalContractInstance.getResults(0, { from: alice });
      const votedProposal = await ProposalContractInstance.proposals(0);
      const proposalResult = votedProposal.accepted;
      expect(proposalResult).to.be.false;
      const proposalStatus = votedProposal.status;
      expect(proposalStatus).to.be.bignumber.equal(new BN(4));
    });
    it('should revert if wrong workflow status', async () => {
      await expectRevert(ProposalContractInstance.getResults(0, { from: alice }), '!Err : Wrong workflow status');
    });
    it('should revert if proposal deadline is not passed', async () => {
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, false, { from: bob });
      await ProposalContractInstance.voteProposal(0, true, { from: john });
      await expectRevert(ProposalContractInstance.getResults(0, { from: alice }), '!Err: Voting still ongoing');
    });
  });
});
