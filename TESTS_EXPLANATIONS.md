# Tests Explanations

*In the test part of the README.md, we mentioned that our smart contracts has been developed following a TDD 
(**T**est **D**rive **D**evelopment) approach ([reference](https://github.com/acarbone/TDD-Cheat-Sheet)).
This file aims to explain how we wrote our tests and the logic behind them.*

:information_source: The testing process describe after focusing on adding a new reward to a campaign,
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
		fundingGoal: 11000,
		durationDays: 30
	};
	const initialRewards = [
		{
			title: "First rewards",
			description: "level1",
			minimumContribution: 100,
			stockLimit: 0,
			nbContributors: 0,
			amount: 0,
			isStockLimited: false
		},
		{
			title: "Second rewards",
			description: "level2",
			minimumContribution: 5,
			stockLimit: 1000,
			nbContributors: 0,
			amount: 0,
			isStockLimited: true
		}
	];
	describe("--- Update Rewards ---", async () => {
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);

		});
		describe("  --- Add a new reward --- ", () => {
			it("should revert if not manager try to add a reward", async () => {
				await expectRevert(CampaignContractInstance.addReward(newReward, {from: bob}), "!Not Authorized");
			});
			it("should add a new reward and emit event", async () => {
			    //we count the intial number of rewards in the campaign
				const initialRewardNb = await CampaignContractInstance.rewardsCounter();
                
                //we add the new reward
				const receipt = await CampaignContractInstance.addReward(newReward, {from: alice});
				//we check that we receive the expected event
				expectEvent(receipt, "CampaignNewRewardsAdded");
                
                // we check that the number of rewards in the campaign has been inscreased by 1 
				const afterRewardNb = await CampaignContractInstance.rewardsCounter();
				expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.add(new BN(1)));

                // we check that the information of the last reward in the campaign are what we added
				const RewardsInfo = await CampaignContractInstance.rewardsList(afterRewardNb);
				expect(RewardsInfo.title).to.be.equal(newReward.title);
            });
        });
    });
});
```

:three: We are running the test that should fail.

:four: If we need new functions, we add them into the contract's interface : (ICampaign.sol)
```
    /**
     * @notice Add a new reward level to the campaign.
     * @dev Only the manager must be able to call it.
     * @param newRewardData Rewards Object that contains all the needed information following the Rewards struct for the campaign
     */
    function addReward(Rewards memory newRewardData) external;
```

:five: We right the minimum of code to make it work

```
    /**
     * @inheritdoc ICampaign
     */
    function addReward(Rewards memory newRewardData) external override {
        require(msg.sender == manager, "!Not Authorized");
        rewardsCounter++;
        _setCampaignReward(rewardsCounter, newRewardData);
        emit CampaignNewRewardsAdded(rewardsCounter);
    }
```

:six: We are running the test again that must pass

:seven: We are refactoring our code:

* The check that only the manager is able to call some functions will be used in several part of the contract.
We then created a modifier that can be easily reused :
```
  modifier onlyManager(){
        require(msg.sender == manager, "!Not Authorized");
        _;
    }
  
  ...
 /**
  * @inheritdoc ICampaign 
  */
  function addReward(Rewards memory newRewardData) external override onlyManager() {
    ...
  }
```

* adding a reward use the same logic as updating a specific reward, all rewards or adding several rewards.
That why we are using a single internal function that refactor the logic of add a reward:
```
/**
     * @notice Internal function that set a new campaign's reward level and making data validation first.
     * @param index uint Index of the reward to add
     * @param data Rewards Object that contains the Reward data following the Rewards struct
     */
    function _setCampaignReward(uint index, Rewards memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        Rewards memory r;
        r.title = data.title;
        r.description = data.description;
        r.minimumContribution = data.minimumContribution;
        r.stockLimit = data.stockLimit;
        r.nbContributors = data.nbContributors;
        r.isStockLimited = data.isStockLimited;
        rewardsList[index] = r;
    }  
```

:eight: We are running our code coverage in order to check that we tested every line of our smart contracts with :
`npm run coverage`

**Thanks to TDD and the code coverage, we are sure to code only what we need and also that what we code has been tested.**

