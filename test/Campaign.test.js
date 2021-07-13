const {expectRevert, expectEvent, BN, time} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignContract = artifacts.require("Campaign");

contract("Campaign", (accounts) => {
	const [manager, alice, bob] = accounts;

	const initialCampaignInfo = {
		title: "First Campaign",
		description: "This is the first campaign of SparkUp",
		fundingGoal: 1000,
		durationDays: 30
	};
	const initialRewards=[
		{
			title:"First rewards",
			description:"level1",
			minimumContribution:100,
			stockLimit:0,
			nbContributors:0,
			amount:0,
			isStockLimited:false
		},
		{
			title:"Second rewards",
			description:"level2",
			minimumContribution:5,
			stockLimit:10,
			nbContributors:0,
			amount:0,
			isStockLimited:true
		}
	];
	let CampaignContractInstance;

	xdescribe("--- Info Creation ---", async () => {
		it("should allow manager to create a campaign with title, description, amount to raise and durationDays", async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				{from: manager}
			);
			await expectEvent.inConstruction(CampaignContractInstance, "newCampaign");
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
				{from: manager}
			), "!Err: Title empty");
		});
		it("should revert if description is empty", async () => {
			const badCampaignInfo = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				{from: manager}
			), "!Err: Description empty");
		});
		it("should revert if fundingGoal is not greater than 100", async () => {
			const badCampaignInfo = {...initialCampaignInfo, fundingGoal: 99};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				{from: manager}
			), "!Err: Funding Goal not enough");
		});
		it("should revert if durationDays is not greater than creation date plus 7 days", async () => {
			const badCampaignInfo = {...initialCampaignInfo, durationDays: 6};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				initialRewards,
				{from: manager}
			), "!Err: durationDays to short");
		});
	});
	describe("--- Rewards creation ---",async ()=>{
		it("should allow manager to create a campaign with rewards",async ()=>{
			// console.log("initialRewards",initialRewards)
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				{from: manager}
			);
			const RewardsInfo = await CampaignContractInstance.getRewardsList();
			console.log(RewardsInfo);
			expect(RewardsInfo[0].title).to.be.equal(initialRewards[0].title);
			expect(RewardsInfo[0].description).to.be.equal(initialRewards[0].description);
		});
		it("should revert if no rewards is defined", async () => {
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				[],
				{from: manager}
			), "!Err: Rewards empty");
		});
		it("should revert if title is empty", async () => {
			const badRewardsInfo = initialRewards.map(reward=>{
				return {...reward, title:""};
			});
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				badRewardsInfo,
				{from: manager}
			), "!Err: Title empty");
		});
		it("should revert if description is empty", async () => {
			const badRewardsInfo = initialRewards.map(reward=>{
				return {...reward, description:""};
			});
			await expectRevert(CampaignContract.new(
				initialCampaignInfo,
				badRewardsInfo,
				{from: manager}
			), "!Err: Description empty");
		});
	});
	xdescribe("--- Update Info ---", async () => {
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				{from: manager}
			);
		});
		it("should revert if not manager update the campaign", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await expectRevert(CampaignContractInstance.updateAllInfoData(updatedData, {from: alice}), "!Not Authorized");
		});
		it("should update the title", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.title).to.be.equal(updatedData.title);
		});
		it("should revert the update it the title is empty", async () => {
			const badUpdatedData = {
				...initialCampaignInfo, title: ""
			}
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: manager}), "!Err: Title empty");
		});
		it("should update the description", async () => {
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.description).to.be.equal(updatedData.description);
		});
		it("should revert if description is empty", async () => {
			const badUpdatedData = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: manager}), "!Err: Description empty");
		});
		it("should update the fundingGoal", async () => {
			const updatedData = {
				...initialCampaignInfo, fundingGoal: 10000
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.fundingGoal).to.be.bignumber.equal(new BN(updatedData.fundingGoal));
		});
		it("should revert if fundingGoal is not greater than 100", async () => {
			const badUpdatedData = {...initialCampaignInfo, fundingGoal: 99};
			await expectRevert(CampaignContractInstance.updateAllInfoData(badUpdatedData, {from: manager}
			), "!Err: Funding Goal not enough");
		});
		it("should update the durationDays", async () => {
			const updatedData = {
				...initialCampaignInfo, durationDays: 10
			}
			await CampaignContractInstance.updateAllInfoData(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.campaignInfo();
			expect(CampaignInfo.durationDays).to.be.bignumber.equal(new BN(updatedData.durationDays));
		});
		it("should revert if durationDays is not greater than creation date plus 7 days", async () => {
			const badUpdatedData = {...initialCampaignInfo, durationDays: 4};
			await expectRevert(CampaignContractInstance.updateAllInfoData(
				badUpdatedData,
				{from: manager}
			), "!Err: durationDays to short");
		});
		it("should emit event after update", async () => {
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			const receipt = await CampaignContractInstance.updateAllInfoData(updatedData, {from: manager});

			expectEvent(receipt, "CampaignInfoUpdated");
		});
	});
	xdescribe("--- Disabled ---", async () => {
		beforeEach(async () => {
			CampaignContractInstance = await CampaignContract.new(
				initialCampaignInfo,
				initialRewards,
				{from: manager}
			);
		});
		it("should revert if not manager try to disable the campaign", async () => {
			await expectRevert(CampaignContractInstance.deleteCampaign({from: alice}), "!Not Authorized");
		});
		it("should emit an event when manager disable the campaign", async () => {
			const receipt = await CampaignContractInstance.deleteCampaign({from: manager});
			expectEvent(receipt, "CampaignDisabled");
		});
		it("should revert if someone try to call function when campaign isDelete", async () => {
			await CampaignContractInstance.deleteCampaign({from: manager});
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			await expectRevert(CampaignContractInstance.updateAllInfoData(updatedData, {from: manager}), "!Err: Disabled");
		});
	})
});
