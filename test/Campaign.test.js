const { expectRevert, time, BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignContract = artifacts.require('Campaign');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const TestUSDCContract = artifacts.require('TestUSDC.sol');

contract('Campaign', (accounts) => {
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
  const newReward = {
    title: 'Third rewards',
    description: 'level3',
    minimumContribution: ether('150').toString(),
    stockLimit: 100,
    nbContributors: 0,
    amount: 0,
    isStockLimited: true,
  };
  let CampaignContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(bob, { from: bob });
    CampaignFactoryContractInstance = await CampaignFactoryContract.new(
      TestUSDCContractInstance.address,
      {
        from: alice,
      }
    );
    const deadline = parseInt((await time.latest()).add(time.duration.days(8)));
    initialCampaignInfo.deadlineDate = deadline;
    const newCampaign = await CampaignFactoryContractInstance.createCampaign(
      initialCampaignInfo,
      initialRewards,
      { from: alice }
    );
    newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
    CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
  });

  describe('--- Update Info ---', async () => {
    it('should revert if not manager update the campaign', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        title: 'Updated',
      };
      await expectRevert(
        CampaignContractInstance.updateCampaign(updatedData, { from: bob }),
        '!Not Authorized'
      );
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
        fundingGoal: ether('20000').toString(),
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.fundingGoal).to.be.bignumber.equal(
        new BN(updatedData.fundingGoal)
      );
    });
    it('should revert if fundingGoal is not greater than 10 000', async () => {
      const badUpdatedData = {
        ...initialCampaignInfo,
        fundingGoal: ether('9999').toString(),
      };
      await expectRevert(
        CampaignContractInstance.updateCampaign(badUpdatedData, {
          from: alice,
        }),
        '!Err: Funding Goal not enough'
      );
    });
    it('should update the deadlineDate', async () => {
      const newDeadLine = parseInt(
        (await time.latest()).add(time.duration.days(10))
      );
      const updatedData = {
        ...initialCampaignInfo,
        deadlineDate: newDeadLine,
      };
      await CampaignContractInstance.updateCampaign(updatedData, {
        from: alice,
      });
      const CampaignResult = await CampaignContractInstance.getCampaignInfo();
      const CampaignInfo = CampaignResult['0'];
      expect(CampaignInfo.deadlineDate).to.be.bignumber.equal(
        new BN(updatedData.deadlineDate)
      );
    });
    it('should revert if deadlineDate is not greater than creation date plus 7 days', async () => {
      const badDeadLine = parseInt(
        (await time.latest()).add(time.duration.days(4))
      );
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
        await expectRevert(
          CampaignContractInstance.addReward(newReward, { from: bob }),
          '!Not Authorized'
        );
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
      it('should add a new reward and emit event', async () => {
        const initialRewardNb = await CampaignContractInstance.rewardsCounter();

        await CampaignContractInstance.addReward(newReward, {
          from: alice,
        });

        const afterRewardNb = await CampaignContractInstance.rewardsCounter();
        expect(afterRewardNb).to.be.bignumber.equal(
          initialRewardNb.add(new BN(1))
        );

        const RewardsInfo = await CampaignContractInstance.rewardsList(
          afterRewardNb
        );
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
      await expectRevert(
        CampaignContractInstance.deleteReward(1, { from: bob }),
        '!Not Authorized'
      );
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
      await expectRevert(
        CampaignContractInstance.deleteReward(10, { from: alice }),
        '!Err: Index not exist'
      );
    });
    it('should allow to delete the last reward', async () => {
      const initialRewardNb = await CampaignContractInstance.rewardsCounter();

      await CampaignContractInstance.deleteReward(initialRewardNb, {
        from: alice,
      });

      const afterRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(afterRewardNb).to.be.bignumber.equal(
        initialRewardNb.sub(new BN(1))
      );

      await expectRevert(
        CampaignContractInstance.deleteReward(initialRewardNb, { from: alice }),
        '!Err: Index not exist'
      );
    });
    it('should swap the index of the reward if the one to be delete is not the last one', async () => {
      //Got 3 rewards
      await CampaignContractInstance.addReward(newReward, { from: alice });
      const initialRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(initialRewardNb).to.be.bignumber.equal(new BN(3));

      await CampaignContractInstance.deleteReward(
        initialRewardNb.sub(new BN(1)),
        { from: alice }
      );

      const afterRewardNb = await CampaignContractInstance.rewardsCounter();
      expect(afterRewardNb).to.be.bignumber.equal(
        initialRewardNb.sub(new BN(1))
      );

      const secondReward = await CampaignContractInstance.rewardsList(
        afterRewardNb
      );
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
      await expectRevert(
        CampaignContractInstance.publishCampaign({ from: bob }),
        '!Not Authorized'
      );
    });
    it('should revert if wrong workflow status', async () => {
      await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      await expectRevert(
        CampaignContractInstance.publishCampaign({ from: alice }),
        '!Err : Wrong workflow status'
      );
    });
    it('should revert if publishCampaign called afeter deadline - 7 days', async () => {
      await time.increase(time.duration.days(15));
      await expectRevert(
        CampaignContractInstance.publishCampaign({ from: alice }),
        '!Err: deadlineDate to short'
      );
    });
  });
  describe('--- Migration ---', async () => {
    it('should allow the manager to change the manager address', async () => {
      await CampaignContractInstance.updateManager(bob, { from: alice });
      const newManager = await CampaignContractInstance.manager();
      expect(newManager).to.be.equal(bob);
    });
    it('should revert if not manager try to change the manager', async () => {
      await expectRevert(
        CampaignContractInstance.updateManager(bob, { from: bob }),
        '!Not Authorized'
      );
    });
  });
  describe('--- Contribute ---', async () => {
    it('should allow contributor to contribute to campaign', async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = ether('100').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      const balanceBob = await CampaignContractInstance.contributorBalances(
        bob
      );

      expect(balanceBob).to.be.bignumber.equal(bobContribution);
      const rewardBob = await CampaignContractInstance.rewardToContributor(
        0,
        bob
      );
      expect(rewardBob).to.be.bignumber.equal(new BN(1));
      const reward = await CampaignContractInstance.rewardsList(0);
      const rewardAmount = reward.amount;
      expect(rewardAmount).to.be.bignumber.equal(bobContribution);
      const rewardContributors = reward.nbContributors;
      expect(rewardContributors).to.be.bignumber.equal(new BN(1));
      const contractBalance =
        await CampaignContractInstance.getContractUSDCBalance();
      expect(contractBalance).to.be.bignumber.equal(bobContribution);
    });
    it('should update workflow to FundingComplete if funding goal reached before campaignDeadlineDate', async () => {
      await CampaignContractInstance.publishCampaign({ from: alice });
      const spender = CampaignContractInstance.address;
      const bobContribution = ether('11000').toString();
      TestUSDCContractInstance.increaseAllowance(spender, bobContribution, {
        from: bob,
      });
      await CampaignContractInstance.contribute(bobContribution, 0, {
        from: bob,
      });
      const status = await CampaignContractInstance.status();
      expect(status).to.be.bignumber.equal(new BN(2));
    });
    it('should revert if wrong workflow status', async () => {
      const spender = CampaignContractInstance.address;
      const bobContribution = ether('5').toString();
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
    it('should revert if campaignDeadlineDate has passed', async () => {
      await time.increase(time.duration.days(15));
      const spender = CampaignContractInstance.address;
      const bobContribution = ether('11000').toString();
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
});
