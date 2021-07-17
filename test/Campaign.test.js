const {expectRevert, expectEvent, BN} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignContract = artifacts.require("Campaign");

contract("Campaign", (accounts) => {
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
	const newReward = {
		title: "Third rewards",
		description: "level3",
		minimumContribution: 150,
		stockLimit: 100,
		nbContributors: 0,
		amount: 0,
		isStockLimited: true
	}
	let CampaignContractInstance;

	describe("--- Info Creation ---", async () => {
		it("should allow manager to create a campaign with title, description, amount to raise and durationDays", async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.title).to.be.equal(initialCampaignInfo.title);
			expect(CampaignInfo.description).to.be.equal(initialCampaignInfo.description);
			expect(CampaignInfo.fundingGoal).to.be.bignumber.equal(new BN(initialCampaignInfo.fundingGoal));
			expect(CampaignInfo.durationDays).to.be.bignumber.equal(new BN(initialCampaignInfo.durationDays));
		});
		it("should revert if title is empty", async () => {
			const badCampaignInfo = {...initialCampaignInfo, title: ""};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			), "!Err: Title empty");
		});
		it("should revert if description is empty", async () => {
			const badCampaignInfo = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			), "!Err: Description empty");
		});
		it("should revert if fundingGoal is not greater than 10 000", async () => {
			const badCampaignInfo = {...initialCampaignInfo, fundingGoal: 9999};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			), "!Err: Funding Goal not enough");
		});
		it("should revert if durationDays is not greater than creation date plus 7 days", async () => {
			const badCampaignInfo = {...initialCampaignInfo, durationDays: 6};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			), "!Err: durationDays to short");
		});
	});
	describe("--- Rewards creation ---", async () => {
		it("should allow manager to create a campaign with rewards", async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);
			const firstRewardsInfo = await CampaignContractInstance.rewardsList(0);
			expect(firstRewardsInfo.title).to.be.equal(initialRewards[0].title);
			expect(firstRewardsInfo.description).to.be.equal(initialRewards[0].description);

			const secondRewardsInfo = await CampaignContractInstance.rewardsList(1);
			expect(secondRewardsInfo.title).to.be.equal(initialRewards[1].title);
			expect(secondRewardsInfo.description).to.be.equal(initialRewards[1].description);
		});
		it("should revert if no rewards is defined", async () => {
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				[],
				alice,
				{from: factory}
			), "!Err: Rewards empty");
		});
		it("should revert if title is empty", async () => {
			const badRewardsInfo = initialRewards.map(reward => {
				return {...reward, title: ""};
			});
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				badRewardsInfo,
				alice,
				{from: factory}
			), "!Err: Title empty");
		});
		it("should revert if description is empty", async () => {
			const badRewardsInfo = initialRewards.map(reward => {
				return {...reward, description: ""};
			});
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				badRewardsInfo,
				alice,
				{from: factory}
			), "!Err: Description empty");
		});
	});
	describe("--- Update Info ---", async () => {
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);
		});
		it("should revert if not manager update the campaign", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await expectRevert(CampaignContractInstance.updateAllInfoData(updatedData, {from: bob}), "!Not Authorized");
		});
		it("should update the title", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: alice});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.title).to.be.equal(updatedData.title);
		});
		it("should revert the update it the title is empty", async () => {
			const badUpdatedData = {
				...initialCampaignInfo, title: ""
			}
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: alice}), "!Err: Title empty");
		});
		it("should update the description", async () => {
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: alice});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.description).to.be.equal(updatedData.description);
		});
		it("should revert if description is empty", async () => {
			const badUpdatedData = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: alice}), "!Err: Description empty");
		});
		it("should update the fundingGoal", async () => {
			const updatedData = {
				...initialCampaignInfo, fundingGoal: 20000
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: alice});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.fundingGoal).to.be.bignumber.equal(new BN(updatedData.fundingGoal));
		});
		it("should revert if fundingGoal is not greater than 10 000", async () => {
			const badUpdatedData = {...initialCampaignInfo, fundingGoal: 9999};
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: alice}
			), "!Err: Funding Goal not enough");
		});
		it("should update the durationDays", async () => {
			const updatedData = {
				...initialCampaignInfo, durationDays: 10
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: alice});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.durationDays).to.be.bignumber.equal(new BN(updatedData.durationDays));
		});
		it("should revert if durationDays is not greater than creation date plus 7 days", async () => {
			const badUpdatedData = {...initialCampaignInfo, durationDays: 4};
			await expectRevert(CampaignContractInstance.updateAllInfoData(
				badUpdatedData,
				{from: alice}
			), "!Err: durationDays to short");
		});
		it("should emit event after update", async () => {
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			const receipt = await CampaignContractInstance.updateAllInfoData(updatedData, {from: alice});

			expectEvent(receipt, "CampaignInfoUpdated");
		});
	});
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
				const initialRewardNb = await CampaignContractInstance.rewardsCounter();

				const receipt = await CampaignContractInstance.addReward(newReward, {from: alice});
				expectEvent(receipt, "CampaignNewRewardsAdded");

				const afterRewardNb = await CampaignContractInstance.rewardsCounter();
				expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.add(new BN(1)));

				const RewardsInfo = await CampaignContractInstance.rewardsList(afterRewardNb);
				expect(RewardsInfo.title).to.be.equal(newReward.title);
			});
		});
		describe("  --- Update All rewards --- ", () => {
			it("should revert if not manager try to update All rewards", async () => {
				const newRewardsInfo = initialRewards.map(a => ({...a}));
				newRewardsInfo[0].title = "Updated";

				await expectRevert(CampaignContractInstance.updateAllRewardsData(newRewardsInfo, {from: bob}), "!Not Authorized");
			});
			it("should update All rewards for manager and emit an event", async () => {
				const newRewardsInfo = initialRewards.map(a => ({...a}));
				newRewardsInfo[0].title = "Updated";

				const receipt = await CampaignContractInstance.updateAllRewardsData(newRewardsInfo, {from: alice});
				expectEvent(receipt, "CampaignRewardsUpdated");

				const RewardsInfo = await CampaignContractInstance.rewardsList(0);
				expect(RewardsInfo.title).to.be.equal(newRewardsInfo[0].title);
			});
			it("should revert if reward has empty title", async () => {
				const badRewardsInfo = initialRewards.map(a => ({...a}));
				badRewardsInfo[1].title = "";

				await expectRevert(CampaignContractInstance.updateAllRewardsData(badRewardsInfo, {from: alice}), "!Err: Title empty");
			});
			it("should revert if rewards array is empty title", async () => {
				await expectRevert(CampaignContractInstance.updateAllRewardsData([], {from: alice}), "!Err: Rewards empty");
			});
			it("should revert if reward has empty description", async () => {
				const badRewardsInfo = initialRewards.map(a => ({...a}));
				badRewardsInfo[1].description = "";

				await expectRevert(CampaignContractInstance.updateAllRewardsData(badRewardsInfo, {from: alice}), "!Err: Description empty");
			});
		});
		describe("  --- Update specific reward --- ", () => {
			it("should revert if update the reward index does not exist", async () => {
				const newRewardsInfo = initialRewards.map(a => ({...a}));
				newRewardsInfo[0].title = "Updated";

				await expectRevert(CampaignContractInstance.updateRewardData(newRewardsInfo[0], 10, {from: alice}), "!Err: Index not exist");
			});
			it("should update the reward at index 1 and emit event", async () => {
				const newRewardsInfo = initialRewards.map(a => ({...a}));
				newRewardsInfo[0].title = "Updated";

				const receipt = await CampaignContractInstance.updateRewardData(newRewardsInfo[0], 1, {from: alice});
				expectEvent(receipt, "CampaignRewardsUpdated");

				const RewardsInfo = await CampaignContractInstance.rewardsList(1);
				expect(RewardsInfo.title).to.be.equal(newRewardsInfo[0].title);
			});
		});
	});
	describe("--- Delete Reward  ---", async () => {
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);
		});
		it("should revert if not manager try to delete a reward", async () => {
			await expectRevert(CampaignContractInstance.deleteReward(1,{from: bob}), "!Not Authorized");
		});
		it("should revert if reward index does not exist", async () => {
			await expectRevert(CampaignContractInstance.deleteReward(10,{from: alice}), "!Err: Index not exist");
		});
		it("should allow to delete the last reward",async ()=>{
			const initialRewardNb = await CampaignContractInstance.rewardsCounter();

			const receipt = await CampaignContractInstance.deleteReward(initialRewardNb,{from: alice});
			expectEvent(receipt,"CampaignRewardDeleted");

			const afterRewardNb = await CampaignContractInstance.rewardsCounter();
			expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.sub(new BN(1)));

			await expectRevert(CampaignContractInstance.deleteReward(initialRewardNb,{from: alice}), "!Err: Index not exist");
		});
		it("should swap the index of the reward if the one to be delete is not the last one",async ()=>{
			//Got 3 rewards
			await CampaignContractInstance.addReward(newReward, {from: alice});
			const initialRewardNb = await CampaignContractInstance.rewardsCounter();
			expect(initialRewardNb).to.be.bignumber.equal(new BN(3));

			const receipt = await CampaignContractInstance.deleteReward(initialRewardNb.sub(new BN(1)),{from: alice});
			expectEvent(receipt,"CampaignRewardDeleted");

			const afterRewardNb = await CampaignContractInstance.rewardsCounter();
			expect(afterRewardNb).to.be.bignumber.equal(initialRewardNb.sub(new BN(1)));

			const secondReward = await CampaignContractInstance.rewardsList(afterRewardNb);
			expect(secondReward.title).to.be.equal(newReward.title);
		});
	});
	describe("--- Migration ---",async ()=>{
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				alice,
				{from: factory}
			);
		});
		it("should allow the manager to change the manager address",async ()=>{
			await CampaignContractInstance.updateManager(bob,{from: alice});
			const newManager = await CampaignContractInstance.manager();
			expect(newManager).to.be.equal(bob);
		});
		it("should revert if not manager try to change the manager", async () => {
			await expectRevert(CampaignContractInstance.updateManager(bob,{from: bob}), "!Not Authorized");
		});
		it("should allow the factory to change the factory address",async ()=>{
			await CampaignContractInstance.updateFactory(bob,{from: factory});
			const newFactory = await CampaignContractInstance.factory();
			expect(newFactory).to.be.equal(bob);
		});

		it("should revert if not factory try to change the factory address", async () => {
			await expectRevert(CampaignContractInstance.updateFactory(bob,{from: alice}), "!Err: Not Factory Contract");
		});
	});
});
