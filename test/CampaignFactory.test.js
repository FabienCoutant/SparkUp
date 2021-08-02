const { expectRevert, expectEvent, time, BN, ether } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const CampaignContract = artifacts.require('Campaign');
const TestUSDCContract = artifacts.require('TestUSDC');
const EscrowContract = artifacts.require('Escrow');
const ProxyFactoryContract = artifacts.require('ProxyFactory');

contract('CampaignFactory', (accounts) => {
  const [owner, alice, bob] = accounts;
  const initialCampaignInfo = {
    title: 'First Campaign',
    description: 'This is the first campaign of SparkUp',
    fundingGoal: ether('100000').toString(),
    deadlineDate: 0,
  };

  let secondInitialCampaignInfo = {};
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

  let CampaignFactoryContractInstance;
  let firstCampaignAddress;
  let firstCampaignContractInstance;
  let secondCampaignAddress;
  let secondCampaignContractInstance;
  let TestUSDCContractInstance;
  let EscrowContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(bob, { from: bob });
    EscrowContractInstance = await EscrowContract.new(TestUSDCContractInstance.address, { from: alice });
    CampaignFactoryContractInstance = await CampaignFactoryContract.new({
      from: owner,
    });
    ProxyFactoryContractInstance = await ProxyFactoryContract.new(
      CampaignFactoryContractInstance.address,
      EscrowContractInstance.address,
      TestUSDCContractInstance.address,
      { from: alice }
    );
    await CampaignFactoryContractInstance.setProxy(ProxyFactoryContractInstance.address);
    const factoryOwner = await CampaignFactoryContractInstance.owner();
    expect(factoryOwner).to.be.equal(owner);
    initialCampaignInfo.deadlineDate = parseInt((await time.latest()).add(time.duration.days(30)));
    secondInitialCampaignInfo = {
      ...initialCampaignInfo,
      title: 'Second Campaign',
    };
  });

  describe('--- Creation ---', async () => {
    it('should allow people to create new campaign', async () => {
      const receipt = await ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {
        from: alice,
      });
      firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
      const contractExist = await CampaignFactoryContractInstance.campaignToId(firstCampaignAddress);
      expect(contractExist).to.be.bignumber.equal(new BN(1));
      const deployedCampaign = await CampaignFactoryContractInstance.deployedCampaigns(1);
      expect(deployedCampaign).to.be.equal(firstCampaignAddress);
      const campaignCounter = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounter).to.be.bignumber.equal(new BN(2));
    });
    it('should emit an event when new campaign has been created', async () => {
      const receipt = await ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {
        from: alice,
      });
      const deployedCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
      expectEvent(receipt, 'newCampaign', {
        campaignAddress: deployedCampaignAddress,
      });
    });
    it('should init correctly the data of the new campaign deployed', async () => {
      const receipt = await ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {
        from: alice,
      });
      firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
      firstCampaignContractInstance = await CampaignContract.at(firstCampaignAddress);
      const campaignFactory = await firstCampaignContractInstance.factory();
      expect(campaignFactory).to.be.equal(CampaignFactoryContractInstance.address);
      const campaignManager = await firstCampaignContractInstance.manager();
      expect(campaignManager).to.be.equal(alice);
      const campaignResult = await firstCampaignContractInstance.getCampaignInfo();
      const campaignInfo = campaignResult['0'];
      expect(campaignInfo.title).to.be.equal(initialCampaignInfo.title);
      expect(campaignInfo.description).to.be.equal(initialCampaignInfo.description);
      expect(campaignInfo.fundingGoal).to.be.bignumber.equal(new BN(initialCampaignInfo.fundingGoal));
      expect(campaignInfo.deadlineDate).to.be.bignumber.equal(new BN(initialCampaignInfo.deadlineDate));
      const campaignReward = await firstCampaignContractInstance.rewardsList(0);
      expect(campaignReward.title).to.be.equal(initialRewards[0].title);
      expect(campaignReward.describe).to.be.equal(initialRewards[0].describe);
      expect(campaignReward.minimumContribution).to.be.bignumber.equal(new BN(initialRewards[0].minimumContribution));
      expect(campaignReward.amount).to.be.bignumber.equal(new BN(initialRewards[0].amount));
      expect(campaignReward.stockLimit).to.be.bignumber.equal(new BN(initialRewards[0].stockLimit));
      expect(campaignReward.nbContributors).to.be.bignumber.equal(new BN(initialRewards[0].nbContributors));
      expect(campaignReward.isStockLimited).to.be.equal(initialRewards[0].isStockLimited);
    });
    it('should revert if campaign title is empty', async () => {
      const badCampaignInfo = { ...initialCampaignInfo, title: '' };
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(badCampaignInfo, initialRewards, {
          from: alice,
        }),
        '!Err: Title empty'
      );
    });
    it('should revert if campaign description is empty', async () => {
      const badCampaignInfo = { ...initialCampaignInfo, description: '' };
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(badCampaignInfo, initialRewards, {
          from: alice,
        }),
        '!Err: Description empty'
      );
    });
    it('should revert if campaign fundingGoal is not greater than 1 000', async () => {
      const badCampaignInfo = {
        ...initialCampaignInfo,
        fundingGoal: ether('999').toString(),
      };
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(badCampaignInfo, initialRewards, {
          from: alice,
        }),
        '!Err: Funding Goal not enough'
      );
    });
    it('should revert if campaign deadlineDate is not greater than creation date plus 7 days', async () => {
      const badDate = (await time.latest()).add(time.duration.days(5));
      const badCampaignInfo = { ...initialCampaignInfo, deadlineDate: badDate };
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(badCampaignInfo, initialRewards, {
          from: alice,
        }),
        '!Err: deadlineDate to short'
      );
    });
    it('should revert if no rewards is defined', async () => {
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, [], { from: alice }),
        '!Err: Rewards empty'
      );
    });
    it('should revert if reeward title is empty', async () => {
      const badRewardsInfo = initialRewards.map((reward) => {
        return { ...reward, title: '' };
      });
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, badRewardsInfo, { from: alice }),
        '!Err: Title empty'
      );
    });
    it('should revert if reward description is empty', async () => {
      const badRewardsInfo = initialRewards.map((reward) => {
        return { ...reward, description: '' };
      });
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, badRewardsInfo, { from: alice }),
        '!Err: Description empty'
      );
    });
    it('should revert if rewards array is greater then 10', async () => {
      //12 rewards
      const badRewardsInfo = [
        ...initialRewards,
        ...initialRewards,
        ...initialRewards,
        ...initialRewards,
        ...initialRewards,
        ...initialRewards,
      ];
      await expectRevert(
        ProxyFactoryContractInstance.createCampaign(initialCampaignInfo, badRewardsInfo, { from: alice }),
        '!Err: Too much Rewards'
      );
    });
    it('should revert if not called by proxy contract', async () => {
      await expectRevert(
        CampaignFactoryContractInstance.addCampaign(bob, {
          from: alice,
        }),
        '!Not Authorized'
      );
    });
  });
  describe('--- Update ---', async () => {
    it('should allow the owner to set a new owner', async () => {
      await CampaignFactoryContractInstance.updateOwner(alice, { from: owner });
      const newOwner = await CampaignFactoryContractInstance.owner();
      expect(newOwner).to.be.equal(alice);
    });
    it('should revert if not owner try to set a new owner', async () => {
      await expectRevert(CampaignFactoryContractInstance.updateOwner(bob, { from: alice }), '!Not Authorized');
    });
    it('should allow the owner to set proxy contract', async () => {
      await CampaignFactoryContractInstance.setProxy(bob, { from: owner });
      const proxyContractAddress = await CampaignFactoryContractInstance.proxyContract();
      expect(proxyContractAddress).to.be.equal(bob);
    });
    it('should revert if not owner try to set a new owner', async () => {
      await expectRevert(CampaignFactoryContractInstance.setProxy(bob, { from: alice }), '!Not Authorized');
    });
  });
  describe('--- Deletion ---', async () => {
    beforeEach(async () => {
      const firstCampaignCreated = await ProxyFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      firstCampaignAddress = firstCampaignCreated.logs[0].args.campaignAddress;
      firstCampaignContractInstance = await CampaignContract.at(firstCampaignAddress);
      const firstCampaignResult = await firstCampaignContractInstance.getCampaignInfo();
      const firstCampaignInfo = firstCampaignResult['0'];
      expect(firstCampaignInfo.title).to.be.equal(initialCampaignInfo.title);

      const secondCampaignCreated = await ProxyFactoryContractInstance.createCampaign(
        secondInitialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      secondCampaignAddress = secondCampaignCreated.logs[0].args.campaignAddress;
      secondCampaignContractInstance = await CampaignContract.at(secondCampaignAddress);
      const secondCampaignResult = await secondCampaignContractInstance.getCampaignInfo();
      const secondCampaignInfo = secondCampaignResult['0'];
      expect(secondCampaignInfo.title).to.be.equal(secondInitialCampaignInfo.title);
      const campaignCounter = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounter).to.be.bignumber.equal(new BN(3));
    });
    it('should allow to create 2 Campaigns and delete the last one', async () => {
      await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });
      const campaignCounter = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounter).to.be.bignumber.equal(new BN(2));
      const firstCampaignId = await CampaignFactoryContractInstance.campaignToId(firstCampaignAddress);
      expect(firstCampaignId).to.be.bignumber.equal(new BN(1));
      const secondCampaignId = await CampaignFactoryContractInstance.campaignToId(secondCampaignAddress);
      expect(secondCampaignId).to.be.bignumber.equal(new BN(0));
    });
    it('should allow to create 3 Campaigns and delete the 2nd one which is replaced by the 3th one', async () => {
      const thirdInitialCampaignInfo = {
        ...initialCampaignInfo,
        title: 'Third Campaign',
      };
      const thirdCampaignCreated = await ProxyFactoryContractInstance.createCampaign(
        thirdInitialCampaignInfo,
        initialRewards,
        { from: alice }
      ); //3rd contract
      const thirdCampaignAddress = thirdCampaignCreated.logs[0].args.campaignAddress;
      const thirdCampaignContractInstance = await CampaignContract.at(thirdCampaignAddress);
      const thirdCampaignResult = await thirdCampaignContractInstance.getCampaignInfo();
      const thirdCampaignInfo = thirdCampaignResult['0'];
      expect(thirdCampaignInfo.title).to.be.equal(thirdInitialCampaignInfo.title);
      const campaignCounterBeforeDelete = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounterBeforeDelete).to.be.bignumber.equal(new BN(4));
      await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });
      const campaignCounterAfterDelete = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounterAfterDelete).to.be.bignumber.equal(new BN(3));
      const thirdCampaignId = await CampaignFactoryContractInstance.campaignToId(thirdCampaignAddress);
      expect(thirdCampaignId).to.be.bignumber.equal(new BN(2));
      const secondCampaignId = await CampaignFactoryContractInstance.campaignToId(secondCampaignAddress);
      expect(secondCampaignId).to.be.bignumber.equal(new BN(0));
      const newCampaignId = await CampaignFactoryContractInstance.deployedCampaigns(2);
      expect(newCampaignId).to.be.equal(thirdCampaignAddress);
    });
    it('should revert if not the manager try to delete it', async () => {
      await expectRevert(secondCampaignContractInstance.deleteCampaign({ from: bob }), '!Not Authorized');
    });
    it('should revert if wrong workflow status', async () => {
      await secondCampaignContractInstance.publishCampaign({
        from: alice,
      });
      await expectRevert(
        secondCampaignContractInstance.deleteCampaign({ from: alice }),
        '!Err : Wrong workflow status'
      );
    });
    it('should revert if not the contract try to call the delete in the factory', async () => {
      await expectRevert(CampaignFactoryContractInstance.deleteCampaign({ from: bob }), '!Err: Not exist');
    });

    it('should revert when the manager call a function of a deleted contract', async () => {
      await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });

      const campaignCounter = await CampaignFactoryContractInstance.campaignCounter();
      expect(campaignCounter).to.be.bignumber.equal(new BN(2));

      const newReward = {
        title: 'Third rewards',
        description: 'level3',
        minimumContribution: ether('150').toString(),
        stockLimit: 100,
        nbContributors: 0,
        amount: 0,
        isStockLimited: true,
      };
      await expectRevert(
        secondCampaignContractInstance.addReward(newReward, { from: alice }),
        '!Err: Campaign Deleted'
      );
    });
  });
});
