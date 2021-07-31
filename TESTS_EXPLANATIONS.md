# Tests Explanations

*In the test part of the README.md, we mentioned that our smart contracts has been developed following a TDD 
(**T**est **D**rive **D**evelopment) approach ([reference](https://github.com/acarbone/TDD-Cheat-Sheet)).
This file aims to explain how we wrote our tests and the logic behind them.*

:information_source: The testing process describe after, focusing on adding a new reward to a campaign,
however the same process has been used for every code line of our smart contracts.

:one: Every test start with a user story :
As a *role/type of user* I want/can *goal* so that *benefit/some reason*

Our user story : As a *contract manager* I can *add a new reward* so that *the campaign get a new reward and emit an event*

This user story give us two information:

* It's possible to add a new reward => we need a addReward function that emit an event if the new reward is correctly added
  
* Only the manager can add a new reward => we need to check the user access

:two: Then we right the basic tests for this user story:


```
contract("Campaign",(accounts)=>{
    const [factory, alice, bob] = accounts;
    const initialCampaignInfo = {
		title: "First Campaign",
		description: "This is the first campaign of SparkUp",
		fundingGoal: ether('11000').toString(),
		durationDays: 0
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
      it('should add a new reward', async () => {
        const initialRewardNb = await CampaignContractInstance.rewardsCounter();

        await CampaignContractInstance.addReward(newReward, {
          from: alice,
        });

        const afterRewardNb = await CampaignContractInstance.rewardsCounter();
        expect(afterRewardNb).to.be.bignumber.equal(
          initialRewardNb.add(new BN(1))
        );

        const RewardsInfo = await CampaignContractInstance.rewardsList(
          afterRewardNb.sub(new BN(1))
        );
        expect(RewardsInfo.title).to.be.equal(newReward.title);
      });
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

:five: We write the minimum of code to make it work

```
    /**
     * @inheritdoc ICampaign
     */
    function addReward(Rewards memory newRewardData) external override {
        _setCampaignReward(rewardsCounter, newRewardData);
        rewardsCounter++;
    }
```

:six: We are running the test again that must pass

:seven: We are refactoring our code:

* The check that only the manager is able to call some functions will be used in several part of the contract.
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

* adding a reward use the same logic as updating a specific reward, all rewards or adding several rewards.
That why we are using a single internal function that refactor the logic of add a reward:
```
   /**
    * @notice Internal function that set a new campaign's info and making data validation first.
    * @param data Info Object that contains the Info data following the Info struct
    */
    function _setCampaignInfo(Info memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        require(data.fundingGoal >= 1000 ether, "!Err: Funding Goal not enough");
        require(createAt + 7 days <= data.deadlineDate, "!Err: deadlineDate to short");
        campaignInfo.title = data.title;
        campaignInfo.description = data.description;
        campaignInfo.fundingGoal = data.fundingGoal;
        campaignInfo.deadlineDate = data.deadlineDate;
    }  
```

:eight: We are running our code coverage in order to check that we tested every line of our smart contracts with :
`npm run coverage`

**Thanks to TDD and the code coverage, we are sure to code only what we need and also that what we code has been tested.**

