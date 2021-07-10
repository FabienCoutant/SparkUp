// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma experimental ABIEncoderV2;

contract Campaign {

    struct Info {
        string title;
        string description;
        uint256 fundingGoal;
        uint256 deadLine;
    }

    address private manager;
    Info private CampaignInfo;

    //Events
    event CampaignInfoUpdated(Info CampaignInfo);

    constructor(Info memory newCampaignData){
        require(bytes(newCampaignData.title).length>0,"!Err: Title empty");
        require(bytes(newCampaignData.description).length>0,"!Err: Description empty");
        require(newCampaignData.fundingGoal>=100,"!Err: Funding Goal not enough");
        require(newCampaignData.deadLine>=(block.timestamp + 7 days),"!Err: DeadLine to short");
        Info storage c = CampaignInfo;
        manager = msg.sender;
        c.title = newCampaignData.title;
        c.description = newCampaignData.description;
        c.fundingGoal = newCampaignData.fundingGoal;
        c.deadLine = newCampaignData.deadLine;
    }

    function updateInfo(Info calldata updatedCampaignInfo) external {
        require(msg.sender == manager, "!Not Authorized");
        require(bytes(updatedCampaignInfo.title).length>0,"!Err: Title empty");
        require(bytes(updatedCampaignInfo.description).length>0,"!Err: Description empty");
        require(updatedCampaignInfo.fundingGoal>=100,"!Err: Funding Goal not enough");
        require(updatedCampaignInfo.deadLine>=(block.timestamp + 7 days),"!Err: DeadLine to short");
        Info storage c = CampaignInfo;
        c.title = updatedCampaignInfo.title;
        c.description = updatedCampaignInfo.description;
        c.fundingGoal = updatedCampaignInfo.fundingGoal;
        c.deadLine = updatedCampaignInfo.deadLine;
        emit CampaignInfoUpdated(CampaignInfo);
    }

    function getCampaignInfo() external view returns (Info memory){
        return CampaignInfo;
    }

}
