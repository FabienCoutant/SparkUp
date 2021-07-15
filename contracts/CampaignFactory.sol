// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma abicoder v2;

import "./Campaign.sol";
import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

contract CampaignFactory is ICampaignFactory {
    address public owner;

    ICampaign[] public deployedCampaigns;
    mapping(address => uint) public contractIndex;
    mapping(address => bool) public contractExist;

    event newCampaign(address campaignAddress);

    constructor(){
        owner = msg.sender;
    }

    function createCampaign(ICampaign.Info memory infoData, ICampaign.Rewards[] memory rewardsData) external override {
        ICampaign _newCampaign = new Campaign(infoData, rewardsData, msg.sender);
        deployedCampaigns.push(_newCampaign);
        contractIndex[address(_newCampaign)] = getLastDeployedCampaignsIndex();
        contractExist[address(_newCampaign)] = true;
        emit newCampaign(address(_newCampaign));
    }

    function getDeployedCampaigns() external view returns (ICampaign[] memory){
        return deployedCampaigns;
    }

    function deleteCampaign() public override returns(bool){
        require(contractExist[msg.sender], "!Err: Not exist");
        uint _indexToSwap = contractIndex[msg.sender];
        if(_indexToSwap != getLastDeployedCampaignsIndex()){
            deployedCampaigns[_indexToSwap] = deployedCampaigns[getLastDeployedCampaignsIndex()];
            contractIndex[address(deployedCampaigns[getLastDeployedCampaignsIndex()])] = _indexToSwap;
        }
        deployedCampaigns.pop();
        delete contractIndex[msg.sender];
        delete contractExist[msg.sender];
        return true;
    }

    function updateOwner() external override {
        require(owner == msg.sender);
        owner = msg.sender;
    }

    function getDeployedCampaignsList() external view returns (ICampaign[] memory){
        return deployedCampaigns;
    }

    function getLastDeployedCampaignsIndex() internal view returns (uint){
        return deployedCampaigns.length - 1;
    }
}
