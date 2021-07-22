const {expectRevert, expectEvent,time} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignFactoryContract = artifacts.require("CampaignFactory");
const CampaignContract = artifacts.require("Campaign");

contract("CampaignFactory", (accounts) => {
	const [owner, alice, bob] = accounts;
	const initialCampaignInfo = {
		title: "First Campaign",
		description: "This is the first campaign of SparkUp",
		fundingGoal: 100000,
		deadlineDate: 0
	};

	let secondInitialCampaignInfo={};
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

	let CampaignFactoryContractInstance;
	let firstCampaignAddress;
	let firstCampaignContractInstance;
	let secondCampaignAddress;
	let secondCampaignContractInstance;

	beforeEach(async () => {
		CampaignFactoryContractInstance = await CampaignFactoryContract.new(
			{from: owner}
		);
		const factoryOwner = await CampaignFactoryContractInstance.owner();
		expect(factoryOwner).to.be.equal(owner);
		initialCampaignInfo.deadlineDate=parseInt((await time.latest()).add(time.duration.days(30)));
		secondInitialCampaignInfo = {...initialCampaignInfo, title: "Second Campaign"};
	});

	describe("--- Creation ---", async () => {
		it("should allow people to create new campaign", async () => {
			const receipt = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {from: alice});
			firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
			const contractExist = await CampaignFactoryContractInstance.contractExist(firstCampaignAddress);
			expect(contractExist).to.be.true;
		});
		it("should emit an event when new campaign has been created", async () => {
			const receipt = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {from: alice});
			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expectEvent(receipt, "newCampaign", {
				campaignAddress: deployedCampaignsList[0]
			});
		});
		it("should init correctly the data of the new campaign deployed", async () => {
			const receipt = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {from: alice});
			firstCampaignAddress = receipt.logs[0].args.campaignAddress; // get the Campaign created address
			firstCampaignContractInstance = await CampaignContract.at(firstCampaignAddress);
			const campaignFactory = await firstCampaignContractInstance.factory();
			expect(campaignFactory).to.be.equal(CampaignFactoryContractInstance.address);
			const campaignManager = await firstCampaignContractInstance.manager();
			expect(campaignManager).to.be.equal(alice);
			const campaignInfo = await firstCampaignContractInstance.campaignInfo();
			expect(campaignInfo.title).to.be.equal(initialCampaignInfo.title);
			const campaignReward = await firstCampaignContractInstance.rewardsList(0);
			expect(campaignReward.title).to.be.equal(initialRewards[0].title);
		});
		it("should return an array with all campaign address", async () => {
			await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {from: alice});
			await CampaignFactoryContractInstance.createCampaign(secondInitialCampaignInfo, initialRewards, {from: alice});
			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(deployedCampaignsList).to.have.lengthOf(2);
		});
	});
	describe("--- Update ---", async () => {
		it("should allow the owner to set a new owner", async () => {
			await CampaignFactoryContractInstance.updateOwner(alice, {from: owner});
			const newOwner = await CampaignFactoryContractInstance.owner();
			expect(newOwner).to.be.equal(alice);
		})
		it("should revert if not owner try to set a new owner",async ()=>{
			await expectRevert(CampaignFactoryContractInstance.updateOwner(bob,{from:alice}),"!Not Authorized");
		});
	});
	describe("--- Deletion ---", async () => {
		beforeEach(async () => {
			const firstCampaignCreated = await CampaignFactoryContractInstance.createCampaign(initialCampaignInfo, initialRewards, {from: alice});
			firstCampaignAddress = firstCampaignCreated.logs[0].args.campaignAddress;
			firstCampaignContractInstance = await CampaignContract.at(firstCampaignAddress);
			const firstCampaignInfo = await firstCampaignContractInstance.campaignInfo();
			expect(firstCampaignInfo.title).to.be.equal(initialCampaignInfo.title);

			const secondCampaignCreated = await CampaignFactoryContractInstance.createCampaign(secondInitialCampaignInfo, initialRewards, {from: alice});
			secondCampaignAddress = secondCampaignCreated.logs[0].args.campaignAddress;
			secondCampaignContractInstance = await CampaignContract.at(secondCampaignAddress);
			const secondCampaignInfo = await secondCampaignContractInstance.campaignInfo();
			expect(secondCampaignInfo.title).to.be.equal(secondInitialCampaignInfo.title);

			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(deployedCampaignsList).to.have.lengthOf(2);
		});
		it("should allow to create 2 Campaigns and delete the last one", async () => {
			const receipt = await secondCampaignContractInstance.deleteCampaign({from: alice});
			expectEvent(receipt, "CampaignDisabled");

			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(deployedCampaignsList).to.have.lengthOf(1);

			const isFirstContractExist = await CampaignFactoryContractInstance.contractExist(firstCampaignAddress);
			expect(isFirstContractExist).to.be.true;

			const isSecondContractExist = await CampaignFactoryContractInstance.contractExist(secondCampaignAddress);
			expect(isSecondContractExist).to.be.false;
		});
		it("should allow to create 3 Campaigns and delete the 2nd one which is replaced by the 3th one", async () => {
			const thirdInitialCampaignInfo = {...initialCampaignInfo, title: "Third Campaign"};
			const thirdCampaignCreated = await CampaignFactoryContractInstance.createCampaign(thirdInitialCampaignInfo, initialRewards, {from: alice}); //3rd contract
			const thirdCampaignAddress = thirdCampaignCreated.logs[0].args.campaignAddress;
			const thirdCampaignContractInstance = await CampaignContract.at(thirdCampaignAddress);
			const thirdCampaignInfo = await thirdCampaignContractInstance.campaignInfo();
			expect(thirdCampaignInfo.title).to.be.equal(thirdInitialCampaignInfo.title);

			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(deployedCampaignsList).to.have.lengthOf(3);

			const receipt = await secondCampaignContractInstance.deleteCampaign({from: alice});
			expectEvent(receipt, "CampaignDisabled")

			const newDeployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(newDeployedCampaignsList).to.have.lengthOf(2);

			const isContract3Exist = await CampaignFactoryContractInstance.contractExist(thirdCampaignAddress);
			expect(isContract3Exist).to.be.true;

			const isPreviousContract2Exist = await CampaignFactoryContractInstance.contractExist(secondCampaignAddress);
			expect(isPreviousContract2Exist).to.be.false;

			expect(newDeployedCampaignsList[1]).to.be.equal(thirdCampaignAddress);
		});
		it("should revert if not the manager try to delete it", async () => {
			await expectRevert(secondCampaignContractInstance.deleteCampaign({from: bob}), "!Not Authorized");
		});
		it("should revert if not the contract try to call the delete in the factory", async () => {
			await expectRevert(CampaignFactoryContractInstance.deleteCampaign({from: bob}), "!Err: Not exist");
		});

		it("should revert when the manager call a function of a deleted contract", async () => {
			const receipt = await secondCampaignContractInstance.deleteCampaign({from: alice});
			expectEvent(receipt, "CampaignDisabled");

			const deployedCampaignsList = await CampaignFactoryContractInstance.getDeployedCampaignsList();
			expect(deployedCampaignsList).to.have.lengthOf(1);

			const newReward = {
				title: "Third rewards",
				description: "level3",
				minimumContribution: 150,
				stockLimit: 100,
				nbContributors: 0,
				amount: 0,
				isStockLimited: true
			}
			await expectRevert(secondCampaignContractInstance.addReward(newReward, {from: alice}), "!Err: Disabled");
		});
	});
});
