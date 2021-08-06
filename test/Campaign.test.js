const { expectRevert, time, BN } = require('@openzeppelin/test-helpers');
const usdc = require('../utils/usdc');
const { expect } = require('chai');
const CampaignContract = artifacts.require('Campaign');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const TestUSDCContract = artifacts.require('TestUSDC');
const EscrowContract = artifacts.require('Escrow');
const ProposalContract = artifacts.require('Proposal');
const CampaignCreatorContract = artifacts.require('CampaignCreator');

contract('Campaign', (accounts) => {
  const [alice, bob, john] = accounts;
  const initialCampaignInfo = {
    title: 'First Campaign',
    description: 'This is the first campaign of SparkUp',
    fundingGoal: usdc('11000').toString(),
    deadlineDate: 0,
  };
  const initialRewards = [
    {
      title: 'First rewards',
      description: 'level1',
      minimumContribution: usdc('100').toString(),
      stockLimit: 0,
      nbContributors: 0,
      amount: 0,
      isStockLimited: false,
    },
    {
      title: 'Second rewards',
      description: 'level2',
      minimumContribution: usdc('5').toString(),
      stockLimit: 1000,
      nbContributors: 0,
      amount: 0,
      isStockLimited: true,
    },
  ];
  const newReward = {
    title: 'Third rewards',
    description: 'level3',
    minimumContribution: usdc('150').toString(),
    stockLimit: 100,
    nbContributors: 0,
    amount: 0,
    isStockLimited: true,
  };

  const newReward2 = {
    title: 'Third rewards',
    description: 'level3',
    minimumContribution: usdc('150').toString(),
    stockLimit: 1,
    nbContributors: 0,
    amount: 0,
    isStockLimited: true,
  };

  const proposal = {
    title: 'First Proposal',
    description: 'This is the first proposal',
    amount: usdc('1500').toString(),
  };

  let CampaignContractInstance;
  let TestUSDCContractInstance;
  let EscrowContractInstance;
  let ProposalContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(bob, { from: bob });
    EscrowContractInstance = await EscrowContract.new(TestUSDCContractInstance.address, { from: alice });
    CampaignFactoryContractInstance = await CampaignFactoryContract.new({
      from: alice,
    });
    CampaignCreatorContractInstance = await CampaignCreatorContract.new(
      CampaignFactoryContractInstance.address,
      EscrowContractInstance.address,
      TestUSDCContractInstance.address,
      { from: alice }
    );
    await CampaignFactoryContractInstance.setCampaignCreator(CampaignCreatorContractInstance.address, { from: alice });
    const deadline = parseInt((await time.latest()).add(time.duration.days(8)));
    initialCampaignInfo.deadlineDate = deadline;
    const newCampaign = await CampaignCreatorContractInstance.createCampaign(initialCampaignInfo, initialRewards, {
      from: alice,
    });
    newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
    CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
  });

  describe('--- Update Info ---', async () => {
    it('should revert if not manager update the campaign', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        title: 'Updated',
      };
      await expectRevert(CampaignContractInstance.updateCampaign(updatedData, { from: bob }), '!Not Authorized');
    });
    it('should revert if wrong workflow status', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        title: 'Updated',
      };
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      await expectRevert(
        CampaignContractInstance.updateCampaign(updatedData, { from: alice }),
        '!Err : Wrong workflow status'
      );
    });
    it('should update the title', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        title: 'Updated',
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.title).to.be.equal(updatedData.title);
    });
    it('should revert the update it the title is empty', async () => {
      const badUpdatedData = {
        ...initialCampaignInfo,
        title: '',
      };
      await expectRevert(
        CampaignContractInstance.updateCampaign(badUpdatedData, {
          from: alice,
        }),
        '!Err: Title empty'
      );
    });
    it('should update the description', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        description: 'Updated',
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.description).to.be.equal(updatedData.description);
    });
    it('should revert if description is empty', async () => {
      const badUpdatedData = { ...initialCampaignInfo, description: '' };
      await expectRevert(
        CampaignContractInstance.updateCampaign(badUpdatedData, {
          from: alice,
        }),
        '!Err: Description empty'
      );
    });
    it('should update the fundingGoal', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        fundingGoal: usdc('20000').toString(),
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.fundingGoal).to.be.bignumber.equal(new BN(updatedData.fundingGoal));
    });
    it('should revert if fundingGoal is not greater than 1 000', async () => {
      const badUpdatedData = {
        ...initialCampaignInfo,
        fundingGoal: usdc('999').toString(),
      };
      await expectRevert(
        CampaignContractInstance.updateCampaign(badUpdatedData, {
          from: alice,
        }),
        '!Err: Funding Goal not enough'
      );
    });
    it('should update the deadlineDate', async () => {
      const newDeadLine = parseInt((await time.latest()).add(time.duration.days(10)));
      const updatedData = {
        ...initialCampaignInfo,
        deadlineDate: newDeadLine,
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.deadlineDate).to.be.bignumber.equal(new BN(updatedData.deadlineDate));
    });
    it('should revert if deadlineDate is not greater than creation date plus 7 days', async () => {
      const badDeadLine = parseInt((await time.latest()).add(time.duration.days(4)));
      const badUpdatedData = {
        ...initialCampaignInfo,
        deadlineDate: badDeadLine,
      };
      await expectRevert(
        CampaignContractInstance.updateCampaign(badUpdatedData, {
          from: alice,
        }),
        '!Err: deadlineDate to short'
      );
    });
    it('should emit event after update', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        description: 'Updated',
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
    });
  });
  describe('--- Update Rewards ---', async () => {
    describe('  --- Add a new reward --- ', () => {
      it('should revert if not manager try to add a reward', async () => {
        await expectRevert(CampaignContractInstance.addReward(newReward, { from: bob }), '!Not Authorized');
      });
      it('should revert if wrong workflow status', async () => {
        await CampaignContractInstance.publishCampaign({
          from: alice,
        });
        await expectRevert(
          CampaignContractInstance.addReward(newReward, { from: alice }),
          '!Err : Wrong workflow status'
        );
      });
      it('should add a new reward', async () => {
        const initialRewardNb = await CampaignContractInstance.rewardsCounter();

        await CampaignContractInstance.addReward(newReward, {
          from: alice,
        });

        const afterRewardNb = await CampaignContractInstance.rewardsCounter();
        expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.add(new BN(1)));

        const RewardsInfo = await CampaignContractInstance.rewardsList(afterRewardNb.sub(new BN(1)));
        expect(RewardsInfo.title).to.be.equal(newReward.title);
      });
    });
    describe('  --- Update reward --- ', () => {
      it('should revert if not manager try to update a reward', async () => {
        const newRewardsInfo = initialRewards.map((a) => ({ ...a }));
        newRewardsInfo[0].title = 'Updated';

        await expectRevert(
          CampaignContractInstance.updateReward(newRewardsInfo[0], 0, {
            from: bob,
          }),
          '!Not Authorized'
        );
      });
      it('should revert if wrong workflow status', async () => {
        const newRewardsInfo = initialRewards.map((a) => ({ ...a }));
        newRewardsInfo[0].title = 'Updated';

        await CampaignContractInstance.publishCampaign({
          from: alice,
        });
        await expectRevert(
          CampaignContractInstance.updateReward(newRewardsInfo[0], 1, {
            from: alice,
          }),
          '!Err : Wrong workflow status'
        );
      });
      it('should revert if update the reward index does not exist', async () => {
        const newRewardsInfo = initialRewards.map((a) => ({ ...a }));
        newRewardsInfo[0].title = 'Updated';

        await expectRevert(
          CampaignContractInstance.updateReward(newRewardsInfo[0], 10, {
            from: alice,
          }),
          '!Err: Index not exist'
        );
      });
      it('should revert if reward has empty title', async () => {
        const badRewardsInfo = initialRewards.map((a) => ({ ...a }));
        badRewardsInfo[1].title = '';
        await expectRevert(
          CampaignContractInstance.updateReward(badRewardsInfo[1], 1, {
            from: alice,
          }),
          '!Err: Title empty'
        );
      });
      it('should revert if reward has empty description', async () => {
        const badRewardsInfo = initialRewards.map((a) => ({ ...a }));
        badRewardsInfo[1].description = '';

        await expectRevert(
          CampaignContractInstance.updateReward(badRewardsInfo[1], 1, {
            from: alice,
          }),
          '!Err: Description empty'
        );
      });
      it('should update the reward at index 1 and emit event', async () => {
        const newRewardsInfo = initialRewards.map((a) => ({ ...a }));
        newRewardsInfo[0].title = 'Updated';

        await CampaignContractInstance.updateReward(newRewardsInfo[0], 1, {
          from: alice,
        });

        const RewardsInfo = await CampaignContractInstance.rewardsList(1);
        expect(RewardsInfo.title).to.be.equal(newRewardsInfo[0].title);
      });
    });
  });
  describe('--- Delete Reward  ---', async () => {
    it('should revert if not manager try to delete a reward', async () => {
      await expectRevert(CampaignContractInstance.deleteReward(1, { from: bob }), '!Not Authorized');
    });
    it('should revert if wrong workflow status', async () => {
      const initialRewardNb = await CampaignContractInstance.rewardsCounter();
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      await expectRevert(
        CampaignContractInstance.deleteReward(initialRewardNb, {
          from: alice,
        }),
        '!Err : Wrong workflow status'
      );
    });
    it('should revert if reward index does not exist', async () => {
      await expectRevert(CampaignContractInstance.deleteReward(10, { from: alice }), '!Err: Index not exist');
    });
    it('should allow to delete the last reward', async () => {
      const initialRewardNb = await CampaignContractInstance.rewardsCounter();

      await CampaignContractInstance.deleteReward(initialRewardNb.sub(new BN(1)), {
        from: alice,
      });

      const afterRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.sub(new BN(1)));
    });
    it('should swap the index of the reward if the one to be delete is not the last one', async () => {
      //Got 3 rewards
      await CampaignContractInstance.addReward(newReward, { from: alice });
      const initialRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(initialRewardNb).to.be.bignumber.equal(new BN(3));

      await CampaignContractInstance.deleteReward(initialRewardNb.sub(new BN(2)), { from: alice });

      const afterRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.sub(new BN(1)));

      const secondReward = await CampaignContractInstance.rewardsList(afterRewardNb.sub(new BN(1)));
      expect(secondReward.title).to.be.equal(newReward.title);
    });
  });
  describe('--- Publish ---', async () => {
    it('should allow manager to publish campaign on correct workflow status', async () => {
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      const status = await CampaignContractInstance.status();
      expect(status).to.be.bignumber.equal(new BN(1));
    });
    it('should revert if called by other than manager', async () => {
      await expectRevert(CampaignContractInstance.publishCampaign({ from: bob }), '!Not Authorized');
    });
    it('should revert if wrong workflow status', async () => {
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      await expectRevert(CampaignContractInstance.publishCampaign({ from: alice }), '!Err : Wrong workflow status');
    });
    it('should revert if publishCampaign called afeter deadline - 7 days', async () => {
      await time.increase(time.duration.days(15));
      await expectRevert(CampaignContractInstance.publishCampaign({ from: alice }), '!Err: deadlineDate to short');
    });
  });
  describe('--- Migration ---', async () => {
    it('should allow the manager to change the manager address', async () => {
      await CampaignContractInstance.updateManager(bob, { from: alice });
      const newManager = await CampaignContractInstance.manager();
      expect(newManager).to.be.equal(bob);
    });
    it('should revert if not manager try to change the manager', async () => {
      await expectRevert(CampaignContractInstance.updateManager(bob, { from: bob }), '!Not Authorized');
    });
  });
  describe('--- Contribute ---', async () => {
    it('should allow contributor to contribute to campaign', async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('100').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      const balanceBob = await CampaignContractInstance.contributorBalances(bob);
      expect(balanceBob).to.be.bignumber.equal(bobContribution);
      const rewardBob = await CampaignContractInstance.rewardToContributor(0, bob);
      expect(rewardBob).to.be.bignumber.equal(new BN(1));
      const reward = await CampaignContractInstance.rewardsList(0);
      const rewardAmount = reward.amount;
      expect(rewardAmount).to.be.bignumber.equal(bobContribution);
      const rewardContributors = reward.nbContributors;
      expect(rewardContributors).to.be.bignumber.equal(new BN(1));
      const contractBalance = await CampaignContractInstance.getContractUSDCBalance();
      expect(contractBalance).to.be.bignumber.equal(bobContribution);
    });
    it('should update workflow to FundingComplete and set totalRaised if funding goal reached before campaignDeadlineDate', async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('11000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      const status = await CampaignContractInstance.status();
      expect(status).to.be.bignumber.equal(new BN(2));
      const totalRaised = await CampaignContractInstance.getContractUSDCBalance();
      expect(totalRaised).to.be.bignumber.equal(new BN(bobContribution));
    });
    it('should revert if wrong workflow status', async () => {
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('5').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await expectRevert(
        CampaignContractInstance.contribute(bobContribution, 0, {
          from: bob,
        }),
        '!Err : Wrong workflow status'
      );
    });
    it('should revert if no more reward inventory', async () => {
      await CampaignContractInstance.addReward(newReward2);
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('150').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      CampaignContractInstance.contribute(bobContribution, 2, {
        from: bob,
      });
      await TestUSDCContractInstance.transfer(john, bobContribution, { from: bob });
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: john,
      });
      await expectRevert(
        CampaignContractInstance.contribute(bobContribution, 2, {
          from: john,
        }),
        '!Err: no more reward'
      );
    });
    it('should revert if campaignDeadlineDate has passed', async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      await time.increase(time.duration.days(15));
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('11000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await expectRevert(
        CampaignContractInstance.contribute(bobContribution, 0, {
          from: bob,
        }),
        '!Err : Campaign contribution has ended'
      );
    });
  });
  describe('--- Refund ---', async () => {
    beforeEach(async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      spender = CampaignContractInstance.address;
    });
    it('should revert if campaignDeadline not passed', async () => {
      const bobContribution = usdc('1000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      await expectRevert(CampaignContractInstance.refund({ from: bob }), '!Err: conditions not met');
    });
    it('should allow contributor to get refund and update workflow status to campaignFailed if campaignPublished, fundingGoal not reached and campaignDeadline passed', async () => {
      const bobContribution = usdc('1000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      await time.increase(time.duration.days(15));
      CampaignContractInstance.getContractUSDCBalance();
      await CampaignContractInstance.refund({ from: bob });
      const bobCampaignBalance = await CampaignContractInstance.contributorBalances(bob);
      expect(bobCampaignBalance).to.be.bignumber.equal(new BN(0));
      const bobTUSDCBalances = await TestUSDCContractInstance.balanceOf(bob);
      const totalSupplyTUSDC = await TestUSDCContractInstance.totalSupply();
      expect(bobTUSDCBalances).to.be.bignumber.equal(totalSupplyTUSDC);
      const contractBalanceAfterRefund = await CampaignContractInstance.getContractUSDCBalance();
      expect(contractBalanceAfterRefund).to.be.bignumber.equal(new BN(0));
      const status = await CampaignContractInstance.status();
      expect(status).to.be.bignumber.equal(new BN(3));
    });
    it('should refund contributor if fundingFailed', async () => {
      const bobContribution = usdc('1000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      await TestUSDCContractInstance.transfer(john, bobContribution, { from: bob });
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: john,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: john,
      });
      await time.increase(time.duration.days(15));
      CampaignContractInstance.getContractUSDCBalance();
      await CampaignContractInstance.refund({ from: bob });
      await CampaignContractInstance.refund({ from: john });
      const johnTUSDCBalances = await TestUSDCContractInstance.balanceOf(john);
      expect(johnTUSDCBalances).to.be.bignumber.equal(bobContribution);
    });
    it('should revert if no funds raised', async () => {
      await expectRevert(CampaignContractInstance.refund({ from: bob }), '!Err: conditions not met');
    });
    it('should revert if wrong workflow status', async () => {
      const bobContribution = usdc('11000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      await time.increase(time.duration.days(15));
      await expectRevert(CampaignContractInstance.refund({ from: bob }), '!Err: wrong workflowstatus');
    });
  });
  describe('--- Launch Proposal ---', async () => {
    beforeEach(async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = usdc('11000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
    });
    it('should allow manager to create proposal contract if funding complete and campaign deadline passed', async () => {
      await time.increase(time.duration.days(15));
      await CampaignContractInstance.launchProposalContract({ from: alice });
      const proposal = await CampaignContractInstance.proposal();
      ProposalContractInstance = await ProposalContract.at(proposal);
      expect(proposal).to.be.equal(ProposalContractInstance.address);
      const campaignManager = await ProposalContractInstance.campaignManager();
      expect(campaignManager).to.be.equal(alice);
      const campaignAddress = await ProposalContractInstance.campaignAddress();
      expect(campaignAddress).to.be.equal(CampaignContractInstance.address);
      const escrowContractTUSDCBalance = await EscrowContractInstance.getContractUSDCBalance();
      const fee = usdc((11000 * 0.05).toString());
      expect(escrowContractTUSDCBalance).to.be.bignumber.equal(fee);
    });
    it('should revert if campaignDeadline not passed', async () => {
      await expectRevert(
        CampaignContractInstance.launchProposalContract({ from: alice }),
        '!Err: campaign deadline not passed'
      );
    });
    it('should revert if proposal contract already deployed', async () => {
      await time.increase(time.duration.days(15));
      await CampaignContractInstance.launchProposalContract({ from: alice });
      await expectRevert(
        CampaignContractInstance.launchProposalContract({ from: alice }),
        '!Err: proposal already deployed'
      );
    });
    it('set proposal should revert if called by other than factory', async () => {
      await time.increase(time.duration.days(15));
      await expectRevert(CampaignContractInstance.setProposal(bob, { from: alice }), '!Not Authorized');
    });
  });
  describe('--- Release Funds ---', async () => {
    beforeEach(async () => {
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      const spender = CampaignContractInstance.address;
      await TestUSDCContractInstance.transfer(john, usdc('2000').toString(), { from: bob });
      const bobContribution = usdc('9000').toString();
      const johnContribution = usdc('2000').toString();
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
      await ProposalContractInstance.createProposal(proposal.title, proposal.description, proposal.amount, {
        from: alice,
      });
      await ProposalContractInstance.startVotingSession(0, { from: alice });
      await ProposalContractInstance.voteProposal(0, true, { from: bob });
      await ProposalContractInstance.voteProposal(0, false, { from: john });
      await time.increase(time.duration.days(10));
    });
    it('should transfer voted proposal amount to manager address', async () => {
      const campaignBalanceBeforeTransfer = await CampaignContractInstance.getContractUSDCBalance();
      await ProposalContractInstance.getResults(0, { from: alice });
      const campaignBalanceAfterTransfer = await CampaignContractInstance.getContractUSDCBalance();
      const balanceDiff = campaignBalanceBeforeTransfer.sub(campaignBalanceAfterTransfer);
      expect(balanceDiff).to.be.bignumber.equal(new BN(proposal.amount));
      const managerTUSDCBalance = await TestUSDCContractInstance.balanceOf(alice);
      expect(managerTUSDCBalance).to.be.bignumber.equal(new BN(proposal.amount));
    });
    it('should revert if called by other than proposal contract', async () => {
      await expectRevert(
        CampaignContractInstance.releaseProposalFunds(proposal.amount, { from: alice }),
        '!Err: Access denied'
      );
    });
  });
});
