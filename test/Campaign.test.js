const {expectRevert, expectEvent, ether, time, BN} = require("@openzeppelin/test-helpers");
const {expect} = require("chai");
const CampaignContract = artifacts.require("Campaign");

contract("Campaign", (accounts) => {
	const [manager, alice, bob] = accounts;

	const initialCampaignInfo = {
		title: "First Campaign",
		description: "This is the first campaign of SparkUp",
		fundingGoal: 1000,
		deadLine: 0
	};
	let CampaignContractInstance;

	beforeEach(async () => {
		const currentTime = await time.latest();
		initialCampaignInfo.deadLine = parseInt(currentTime.add(time.duration.days(30))); // add 30*24*60*60 = 2592000 seconds
		CampaignContractInstance = await CampaignContract.new(
			initialCampaignInfo,
			{from: manager}
		);
	});

	xdescribe("--- Creation ---", async () => {
		it("should allow people to create a campaign with title, description, amount to raise and deadline data and receive an event", async () => {
			const CampaignInfo = await CampaignContractInstance.getCampaignInfo();
			expect(CampaignInfo.title).to.be.equal(initialCampaignInfo.title);
			expect(CampaignInfo.description).to.be.equal(initialCampaignInfo.description);
			expect(CampaignInfo.fundingGoal).to.be.equal(initialCampaignInfo.fundingGoal.toString());
			expect(CampaignInfo.deadLine).to.be.equal(initialCampaignInfo.deadLine.toString());
		});
		it("should revert if title is empty", async () => {
			const badCampaignInfo = {...initialCampaignInfo, title: ""};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				{from: manager}
			), "!Err: Title empty");
		});
		it("should revert if description is empty", async () => {
			const badCampaignInfo = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				{from: manager}
			), "!Err: Description empty");
		});
		it("should revert if fundingGoal is not greater than 100", async () => {
			const badCampaignInfo = {...initialCampaignInfo, fundingGoal: 99};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				{from: manager}
			), "!Err: Funding Goal not enough");
		});
		it("should revert if deadLine is not greater than now plus 7 days", async () => {
			const currentTime = await time.latest();
			const badDeadLine = parseInt(currentTime.add(time.duration.days(6)));
			const badCampaignInfo = {...initialCampaignInfo, deadLine: badDeadLine};
			await expectRevert(CampaignContract.new(
				badCampaignInfo,
				{from: manager}
			), "!Err: DeadLine to short");
		});
	});
	xdescribe("--- Update ---", async () => {
		it("should revert if not manager update the campaign", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await expectRevert(CampaignContractInstance.updateInfo(updatedData, {from: alice}), "!Not Authorized");
		});
		it("should update the title", async () => {
			const updatedData = {
				...initialCampaignInfo, title: "Updated"
			}
			await CampaignContractInstance.updateInfo(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.getCampaignInfo();
			expect(CampaignInfo.title).to.be.equal(updatedData.title);
		});
		it("should revert the update it the title is empty", async () => {
			const badUpdatedData = {
				...initialCampaignInfo, title: ""
			}
			await expectRevert(CampaignContractInstance.updateInfo(badUpdatedData, {from: manager}), "!Err: Title empty");
		});
		it("should update the description", async () => {
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			await CampaignContractInstance.updateInfo(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.getCampaignInfo();
			expect(CampaignInfo.description).to.be.equal(updatedData.description);
		});
		it("should revert if description is empty", async () => {
			const badUpdatedData = {...initialCampaignInfo, description: ""};
			await expectRevert(CampaignContractInstance.updateInfo(badUpdatedData, {from: manager}), "!Err: Description empty");
		});
		it("should update the fundingGoal", async () => {
			const updatedData = {
				...initialCampaignInfo, fundingGoal: 10000
			}
			await CampaignContractInstance.updateInfo(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.getCampaignInfo();
			expect(CampaignInfo.fundingGoal).to.be.equal(updatedData.fundingGoal.toString());
		});
		it("should revert if fundingGoal is not greater than 100", async () => {
			const badUpdatedData = {...initialCampaignInfo, fundingGoal: 99};
			await expectRevert(CampaignContractInstance.updateInfo(badUpdatedData, {from: manager}
			), "!Err: Funding Goal not enough");
		});
		it("should update the deadLine", async () => {
			const currentTime = await time.latest();
			const newDeadLine = parseInt(currentTime.add(time.duration.days(50)));
			const updatedData = {
				...initialCampaignInfo, deadLine: newDeadLine
			}
			await CampaignContractInstance.updateInfo(updatedData, {from: manager});
			const CampaignInfo = await CampaignContractInstance.getCampaignInfo();
			expect(CampaignInfo.deadLine).to.be.equal(updatedData.deadLine.toString());
		});
		it("should revert if deadLine is not greater than now plus 7 days", async () => {
			const currentTime = await time.latest();
			const badDeadLine = parseInt(currentTime.add(time.duration.days(6)));
			const badUpdatedData = {...initialCampaignInfo, deadLine: badDeadLine};
			await expectRevert(CampaignContractInstance.updateInfo(
				badUpdatedData,
				{from: manager}
			), "!Err: DeadLine to short");
		});
		it("should emit event after update",async () =>{
			const updatedData = {
				...initialCampaignInfo, description: "Updated"
			}
			const receipt = await CampaignContractInstance.updateInfo(updatedData, {from: manager});

			expectEvent(receipt,"CampaignInfoUpdated", [[
				updatedData.title,updatedData.description,updatedData.fundingGoal.toString(),updatedData.deadLine.toString()
			]]);
		});

	});
});
