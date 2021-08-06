# Tests Explanations

_In the test section of the README.md, we mentioned that our smart contracts has been developed following a TDD
(**T**est **D**rive **D**evelopment) approach ([reference](https://github.com/acarbone/TDD-Cheat-Sheet)).
This file aims to explain how we wrote our tests and the logic behind them._

:information_source: The testing example below uses the case of adding a new reward to a campaign,
however it illustrates the methodology used for our full testing process.

:one: Every test start with a user story :
As a _role/type of user_ I want/can _goal_ so that _benefit/some reason_

Our user story : As a _contract manager_ I can _add a new reward_ so that _the campaign get a new reward and emit an event_

This user story give us two information:

- It's possible to add a new reward => we need a addReward function that updates correctly the rewardList if the new reward is correctly added
- Only the manager can add a new reward => we need to check the user access

:two: Then we write the basic tests for this user story:

```
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
```

:three: We are running the test that must fail.

:four: If we need new functions, we add them into the contract's interface : (ICampaign.sol)

```
    /**
     * @notice Add a new reward level to the campaign.
     * @dev Only the manager must be able to call it.
     * @param newRewardData Rewards Object that contains all the needed information following the Rewards struct for the campaign
     */
    function addReward(Rewards memory newRewardData) external;
```

:five: We write the minimum amount of code to make it work

```
    /**
     * @inheritdoc ICampaign
     */
    function addReward(Rewards memory newRewardData) external override {
        _setCampaignReward(rewardsCounter, newRewardData);
        rewardsCounter++;
    }
```

:six: We run the test again that must pass

:seven: We refactor our code:

- The verification that only the manager is able to call some functions will be used in several part of the contract.
  We then created a modifier that can be easily reused :

```
  modifier isNotDeleted(){
    require(status != WorkflowStatus.CampaignDeleted, "!Err: Campaign Deleted");
    _;
  }

  ...
 /**
 * @inheritdoc ICampaign
 */
 function addReward(Rewards memory newRewardData) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
    _setCampaignReward(rewardsCounter, newRewardData);
    rewardsCounter++;
 }
```

- adding a reward uses the same logic as updating a specific reward or adding several rewards.
  Thus we are using a single internal function that refactor the logic of adding a reward:

```
/**
* @notice Internal function that set a new campaign's info and making data validation first.
* @param _data The Info Object that contains the Info data which follow the Info struct
*/
function _setCampaignInfo(Info memory _data) private {
    require(bytes(_data.title).length > 0, "!Err: Title empty");
    require(bytes(_data.description).length > 0, "!Err: Description empty");
    require(_data.fundingGoal >= 1000*10**6, "!Err: Funding Goal not enough");
    require(createAt + 7 days <= _data.deadlineDate, "!Err: deadlineDate to short");
    campaignInfo.title = _data.title;
    campaignInfo.description = _data.description;
    campaignInfo.fundingGoal = _data.fundingGoal;
    campaignInfo.deadlineDate = _data.deadlineDate;
}
```

:eight: We run our code coverage in order to check that we tested every line of our smart contracts with :
`npm run coverage`

**Thanks to TDD and the code coverage, we are sure to code only what we need and also that what we code what has already been tested.**
