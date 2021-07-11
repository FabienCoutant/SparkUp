// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma abicoder v2;

contract Campaign {

    struct Info {
        string title;
        string description;
        uint256 fundingGoal;
        uint256 deadLine;
    }

    address private manager;
    bool private isDelete;
    Info private CampaignInfo;

    //Events
    event CampaignInfoUpdated(Info CampaignInfo);
    event CampaignDisabled();

    //Modifiers
    modifier dataValidation(Info memory data){
        require(bytes(data.title).length>0,"!Err: Title empty");
        require(bytes(data.description).length>0,"!Err: Description empty");
        require(data.fundingGoal>=100,"!Err: Funding Goal not enough");
        require(data.deadLine>=(block.timestamp + 7 days),"!Err: DeadLine to short");
        _;
    }

    modifier isNotDelete(){
        require(!isDelete,"!Err: Deleted");
        _;
    }

    modifier onlyManager(){
        require(msg.sender==manager,"!Not Authorized");
        _;
    }


    constructor(Info memory newCampaignData) dataValidation(newCampaignData){
        manager = msg.sender;
        _setCampaignInfo(newCampaignData);
    }

    function updateInfo(Info memory updatedCampaignData) external isNotDelete() onlyManager() dataValidation(updatedCampaignData){
        _setCampaignInfo(updatedCampaignData);
        emit CampaignInfoUpdated(CampaignInfo);
    }

    function _setCampaignInfo(Info memory newCampaignData) private{
        Info storage c = CampaignInfo;
        c.title = newCampaignData.title;
        c.description = newCampaignData.description;
        c.fundingGoal = newCampaignData.fundingGoal;
        c.deadLine = newCampaignData.deadLine;
    }
    function getCampaignInfo() external view returns (Info memory){
        return CampaignInfo;
    }
    function getIsDelete() external view returns(bool){
        return isDelete;
    }
    function deleteCampaign() external isNotDelete() onlyManager(){
        isDelete=true;
        emit CampaignDisabled();
    }
}
