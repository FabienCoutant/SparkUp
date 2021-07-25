const {
  expectRevert,
  expectEvent,
  time,
  BN,
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignContract = artifacts.require('Campaign');
const CampaignFactoryContract = artifacts.require('CampaignFactory');

contract('Campaign', (accounts) => {
  const [alice, bob] = accounts;

  const initialCampaignInfo = {
    title: 'First Campaign',
    description: 'This is the first campaign of SparkUp',
    fundingGoal: 11000,
    deadlineDate: new Date().setDate(new Date().getDate() + 7),
  };
  const initialRewards = [
    {
      title: 'First rewards',
      description: 'level1',
      minimumContribution: 100,
      stockLimit: 0,
      nbContributors: 0,
      amount: 0,
      isStockLimited: false,
    },
    {
      title: 'Second rewards',
      description: 'level2',
      minimumContribution: 5,
      stockLimit: 1000,
      nbContributors: 0,
      amount: 0,
      isStockLimited: true,
    },
  ];
  const newReward = {
    title: 'Third rewards',
    description: 'level3',
    minimumContribution: 150,
    stockLimit: 100,
    nbContributors: 0,
    amount: 0,
    isStockLimited: true,
  };
  let CampaignContractInstance;

  describe('--- Update Info ---', async () => {
    beforeEach(async () => {
      CampaignFactoryContractInstance = await CampaignFactoryContract.new({
        from: alice,
      });
      const newCampaign = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
      CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    });
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
    it('should revert and delete campaign if past publish deadline', async () => {
      const updatedData = {
        ...initialCampaignInfo,
        title: 'Updated',
      };
      const createAt = await CampaignContractInstance.createAt();
      const futureDate = await createAt.add(time.duration.days(15));
      const duration = futureDate - createAt;
      time.increase(duration);
      await expectRevert(
        CampaignContractInstance.updateCampaign(updatedData, { from: alice }),
        '!Err: Campaign deleted due to missed publish deadline'
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
        fundingGoal: 20000,
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
      const badUpdatedData = { ...initialCampaignInfo, fundingGoal: 9999 };
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
      const receipt = await CampaignContractInstance.updateCampaign(
        updatedData,
        { from: alice }
      );

      expectEvent(receipt, 'CampaignInfoUpdated');
    });
  });
  describe('--- Update Rewards ---', async () => {
    beforeEach(async () => {
      CampaignFactoryContractInstance = await CampaignFactoryContract.new({
        from: alice,
      });
      const newCampaign = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
      CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    });
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

        const receipt = await CampaignContractInstance.addReward(newReward, {
          from: alice,
        });
        expectEvent(receipt, 'CampaignNewRewardsAdded');

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

        const receipt = await CampaignContractInstance.updateReward(
          newRewardsInfo[0],
          1,
          { from: alice }
        );
        expectEvent(receipt, 'CampaignRewardsUpdated');

        const RewardsInfo = await CampaignContractInstance.rewardsList(1);
        expect(RewardsInfo.title).to.be.equal(newRewardsInfo[0].title);
      });
    });
  });
  describe('--- Delete Reward  ---', async () => {
    beforeEach(async () => {
      CampaignFactoryContractInstance = await CampaignFactoryContract.new({
        from: alice,
      });
      const newCampaign = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
      CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    });
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

      const receipt = await CampaignContractInstance.deleteReward(
        initialRewardNb,
        { from: alice }
      );
      expectEvent(receipt, 'CampaignRewardDeleted');

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

      const receipt = await CampaignContractInstance.deleteReward(
        initialRewardNb.sub(new BN(1)),
        { from: alice }
      );
      expectEvent(receipt, 'CampaignRewardDeleted');

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
    beforeEach(async () => {
      CampaignFactoryContractInstance = await CampaignFactoryContract.new({
        from: alice,
      });
      const newCampaign = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
      CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    });
    it('should allow manager to publish campaign on correct workflow status', async () => {
      const receipt = await CampaignContractInstance.publishCampaign({
        from: alice,
      });
      expectEvent(receipt, 'WorkflowStatusChange', {
        previousStatus: new BN(0),
        newStatus: new BN(1),
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
  });
  describe('--- Migration ---', async () => {
    beforeEach(async () => {
      CampaignFactoryContractInstance = await CampaignFactoryContract.new({
        from: alice,
      });
      const newCampaign = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      newCampaignAddress = newCampaign.logs[0].args.campaignAddress;
      CampaignContractInstance = await CampaignContract.at(newCampaignAddress);
    });
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
    it('should allow the factory to change the factory address', async () => {
      const campaignFactoryAddress = await CampaignContractInstance.factory();
      console.log(campaignFactoryAddress);
      await CampaignContractInstance.updateFactory(bob, {
        from: campaignFactoryAddress,
      });
      const newFactory = await CampaignContractInstance.factory();
      expect(newFactory).to.be.equal(bob);
    });

    it('should revert if not factory try to change the factory address', async () => {
      await expectRevert(
        CampaignContractInstance.updateFactory(bob, { from: alice }),
        '!Err: Not Factory Contract'
      );
    });
  });
});
