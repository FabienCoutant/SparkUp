const {
  expectRevert,
  expectEvent,
  time,
  BN,
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CampaignFactoryContract = artifacts.require('CampaignFactory');
const CampaignContract = artifacts.require('Campaign');

contract('CampaignFactory', (accounts) => {
  const [owner, alice, bob] = accounts;
  const initialCampaignInfo = {
    title: 'First Campaign',
    description: 'This is the first campaign of SparkUp',
    fundingGoal: 100000,
    deadlineDate: 0,
  };

  let secondInitialCampaignInfo = {};
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

  let CampaignFactoryContractInstance;
  let firstCampaignAddress;
  let firstCampaignContractInstance;
  let secondCampaignAddress;
  let secondCampaignContractInstance;

  beforeEach(async () => {
    CampaignFactoryContractInstance = await CampaignFactoryContract.new({
      from: owner,
    });
    const factoryOwner = await CampaignFactoryContractInstance.owner();
    expect(factoryOwner).to.be.equal(owner);
    initialCampaignInfo.deadlineDate = parseInt(
      (await time.latest()).add(time.duration.days(30))
    );
    secondInitialCampaignInfo = {
      ...initialCampaignInfo,
      title: 'Second Campaign',
    };
  });

  xdescribe('--- Creation ---', async () => {
    it('should allow people to create new campaign', async () => {
      const receipt = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
      const contractExist = await CampaignFactoryContractInstance.contractExist(
        firstCampaignAddress
      );
      expect(contractExist).to.be.true;
    });
    it('should emit an event when new campaign has been created', async () => {
      const receipt = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expectEvent(receipt, 'newCampaign', {
        campaignAddress: deployedCampaignsList[0],
      });
    });
    it('should init correctly the data of the new campaign deployed', async () => {
      const receipt = await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
      firstCampaignContractInstance = await CampaignContract.at(
        firstCampaignAddress
      );
      const campaignFactory = await firstCampaignContractInstance.factory();
      expect(campaignFactory).to.be.equal(
        CampaignFactoryContractInstance.address
      );
      const campaignManager = await firstCampaignContractInstance.manager();
      expect(campaignManager).to.be.equal(alice);
      const campaignResult =
        await firstCampaignContractInstance.getCampaignInfo();
      const campaignInfo = campaignResult['0'];
      expect(campaignInfo.title).to.be.equal(initialCampaignInfo.title);
      expect(campaignInfo.description).to.be.equal(
        initialCampaignInfo.description
      );
      expect(campaignInfo.fundingGoal).to.be.bignumber.equal(
        new BN(initialCampaignInfo.fundingGoal)
      );
      expect(campaignInfo.deadlineDate).to.be.bignumber.equal(
        new BN(initialCampaignInfo.deadlineDate)
      );
      const campaignReward = await firstCampaignContractInstance.rewardsList(0);
      expect(campaignReward.title).to.be.equal(initialRewards[0].title);
      expect(campaignReward.describe).to.be.equal(initialRewards[0].describe);
      expect(campaignReward.minimumContribution).to.be.bignumber.equal(
        new BN(initialRewards[0].minimumContribution)
      );
      expect(campaignReward.amount).to.be.bignumber.equal(
        new BN(initialRewards[0].amount)
      );
      expect(campaignReward.stockLimit).to.be.bignumber.equal(
        new BN(initialRewards[0].stockLimit)
      );
      expect(campaignReward.nbContributors).to.be.bignumber.equal(
        new BN(initialRewards[0].nbContributors)
      );
      expect(campaignReward.isStockLimited).to.be.equal(
        initialRewards[0].isStockLimited
      );
    });
    it('should revert if  campaign title is empty', async () => {
      const badCampaignInfo = { ...initialCampaignInfo, title: '' };
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          badCampaignInfo,
          initialRewards,
          {
            from: alice,
          }
        ),
        '!Err: Title empty'
      );
    });
    it('should revert if campaign description is empty', async () => {
      const badCampaignInfo = { ...initialCampaignInfo, description: '' };
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          badCampaignInfo,
          initialRewards,
          {
            from: alice,
          }
        ),
        '!Err: Description empty'
      );
    });
    it('should revert if campaign fundingGoal is not greater than 10 000', async () => {
      const badCampaignInfo = { ...initialCampaignInfo, fundingGoal: 9999 };
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          badCampaignInfo,
          initialRewards,
          {
            from: alice,
          }
        ),
        '!Err: Funding Goal not enough'
      );
    });
    it('should revert if campaign deadlineDate is not greater than creation date plus 7 days', async () => {
      const badDate = (await time.latest()).add(time.duration.days(5));
      const badCampaignInfo = { ...initialCampaignInfo, deadlineDate: badDate };
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          badCampaignInfo,
          initialRewards,
          {
            from: alice,
          }
        ),
        '!Err: deadlineDate to short'
      );
    });
    it('should return an array with all campaign address', async () => {
      await CampaignFactoryContractInstance.createCampaign(
        initialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      await CampaignFactoryContractInstance.createCampaign(
        secondInitialCampaignInfo,
        initialRewards,
        { from: alice }
      );
      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(deployedCampaignsList).to.have.lengthOf(2);
    });
    it('should revert if no rewards is defined', async () => {
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          initialCampaignInfo,
          [],
          { from: alice }
        ),
        '!Err: Rewards empty'
      );
    });
    it('should revert if reeward title is empty', async () => {
      const badRewardsInfo = initialRewards.map((reward) => {
        return { ...reward, title: '' };
      });
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          initialCampaignInfo,
          badRewardsInfo,
          { from: alice }
        ),
        '!Err: Title empty'
      );
    });
    it('should revert if reward description is empty', async () => {
      const badRewardsInfo = initialRewards.map((reward) => {
        return { ...reward, description: '' };
      });
      await expectRevert(
        CampaignFactoryContractInstance.createCampaign(
          initialCampaignInfo,
          badRewardsInfo,
          { from: alice }
        ),
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
        CampaignFactoryContractInstance.createCampaign(
          initialCampaignInfo,
          badRewardsInfo,
          { from: alice }
        ),
        '!Err: Too much Rewards'
      );
    });
  });
  xdescribe('--- Update ---', async () => {
    it('should allow the owner to set a new owner', async () => {
      await CampaignFactoryContractInstance.updateOwner(alice, { from: owner });
      const newOwner = await CampaignFactoryContractInstance.owner();
      expect(newOwner).to.be.equal(alice);
    });
    it('should revert if not owner try to set a new owner', async () => {
      await expectRevert(
        CampaignFactoryContractInstance.updateOwner(bob, { from: alice }),
        '!Not Authorized'
      );
    });
  });
  describe('--- Deletion ---', async () => {
    beforeEach(async () => {
      const firstCampaignCreated =
        await CampaignFactoryContractInstance.createCampaign(
          initialCampaignInfo,
          initialRewards,
          { from: alice }
        );
      firstCampaignAddress = firstCampaignCreated.logs[0].args.campaignAddress;
      firstCampaignContractInstance = await CampaignContract.at(
        firstCampaignAddress
      );
      const firstCampaignResult =
        await firstCampaignContractInstance.getCampaignInfo();
      const firstCampaignInfo = firstCampaignResult['0'];
      expect(firstCampaignInfo.title).to.be.equal(initialCampaignInfo.title);

      const secondCampaignCreated =
        await CampaignFactoryContractInstance.createCampaign(
          secondInitialCampaignInfo,
          initialRewards,
          { from: alice }
        );
      secondCampaignAddress =
        secondCampaignCreated.logs[0].args.campaignAddress;
      secondCampaignContractInstance = await CampaignContract.at(
        secondCampaignAddress
      );
      const secondCampaignResult =
        await secondCampaignContractInstance.getCampaignInfo();
      const secondCampaignInfo = secondCampaignResult['0'];
      expect(secondCampaignInfo.title).to.be.equal(
        secondInitialCampaignInfo.title
      );

      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(deployedCampaignsList).to.have.lengthOf(2);
    });
    it('should allow to create 2 Campaigns and delete the last one', async () => {
      const receipt = await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });
      expectEvent(receipt, 'CampaignDisabled');

      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(deployedCampaignsList).to.have.lengthOf(1);

      const isFirstContractExist =
        await CampaignFactoryContractInstance.contractExist(
          firstCampaignAddress
        );
      expect(isFirstContractExist).to.be.true;

      const isSecondContractExist =
        await CampaignFactoryContractInstance.contractExist(
          secondCampaignAddress
        );
      expect(isSecondContractExist).to.be.false;
    });
    it('should allow to create 3 Campaigns and delete the 2nd one which is replaced by the 3th one', async () => {
      const thirdInitialCampaignInfo = {
        ...initialCampaignInfo,
        title: 'Third Campaign',
      };
      const thirdCampaignCreated =
        await CampaignFactoryContractInstance.createCampaign(
          thirdInitialCampaignInfo,
          initialRewards,
          { from: alice }
        ); //3rd contract
      const thirdCampaignAddress =
        thirdCampaignCreated.logs[0].args.campaignAddress;
      const thirdCampaignContractInstance = await CampaignContract.at(
        thirdCampaignAddress
      );
      const thirdCampaignResult =
        await thirdCampaignContractInstance.getCampaignInfo();
      const thirdCampaignInfo = thirdCampaignResult['0'];
      expect(thirdCampaignInfo.title).to.be.equal(
        thirdInitialCampaignInfo.title
      );

      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(deployedCampaignsList).to.have.lengthOf(3);

      const receipt = await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });
      expectEvent(receipt, 'CampaignDisabled');

      const newDeployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(newDeployedCampaignsList).to.have.lengthOf(2);

      const isContract3Exist =
        await CampaignFactoryContractInstance.contractExist(
          thirdCampaignAddress
        );
      expect(isContract3Exist).to.be.true;

      const isPreviousContract2Exist =
        await CampaignFactoryContractInstance.contractExist(
          secondCampaignAddress
        );
      expect(isPreviousContract2Exist).to.be.false;

      expect(newDeployedCampaignsList[1]).to.be.equal(thirdCampaignAddress);
    });
    it('should revert if not the manager try to delete it', async () => {
      await expectRevert(
        secondCampaignContractInstance.deleteCampaign({ from: bob }),
        '!Not Authorized'
      );
    });
    it('should revert if not the contract try to call the delete in the factory', async () => {
      await expectRevert(
        CampaignFactoryContractInstance.deleteCampaign({ from: bob }),
        '!Err: Not exist'
      );
    });

    it('should revert when the manager call a function of a deleted contract', async () => {
      const receipt = await secondCampaignContractInstance.deleteCampaign({
        from: alice,
      });
      expectEvent(receipt, 'CampaignDisabled');

      const deployedCampaignsList =
        await CampaignFactoryContractInstance.getDeployedCampaignsList();
      expect(deployedCampaignsList).to.have.lengthOf(1);

      const newReward = {
        title: 'Third rewards',
        description: 'level3',
        minimumContribution: 150,
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
