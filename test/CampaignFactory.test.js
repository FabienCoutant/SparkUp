const {expectRevert, expectEvent, ether, time, BN} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignFactoryContract = artifacts.require("CampaignFactory");
const CampaignContract = artifacts.require("Campaign");

contract("CampaignFactory", (accounts) => {
	const [owner, alice, bob] = accounts;

	const initialCampaignInfo = {
		title: "First Campaign",
		description: "This is the first campaign of SparkUp",
		fundingGoal: 1000,
		durationDays: 30
	};
	let CampaignFactoryContractInstance;

	beforeEach(async ()=>{
		CampaignFactoryContractInstance = await CampaignFactoryContract.new(
			{from: owner}
		);
	});

	describe("--- Creation ---", async () => {
		it("should allow people to create new campaign and init it",async ()=>{
			const CampaignContractInstance = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo,{from:alice});
			console.log(CampaignContractInstance);
			expectEvent(CampaignContractInstance,"newCampaign");
		});
	});
});
