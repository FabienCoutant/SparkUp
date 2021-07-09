const {expectRevert, expectEvent,ether, BN} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignContract = artifacts.require("Campaign");

contract("Campaign", (accounts)=>{
	const [owner,participant1,participant2] = accounts;

	let campaignContract;

	beforeEach(async ()=>{
		campaignContract = await CampaignContract.new({from:owner});
	});

	describe("--- Creation ---", async ()=>{
		it("should allow people to create a campaign", async ()=>{
			const title = "First Campaign";
			const description = "This is the first campaing of SparkUp";
			const amountToRaise = ether(100000)//
			campaignContract = await CampaignContract.new(Title,Description,{from:owner});
		});
	})
});
