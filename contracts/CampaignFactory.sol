// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./Campaign.sol";
import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

/**
* @title CampaignFactory
* @notice The Campaign factory is used for the deployment of new campaign
* @dev Inherit of for the CampaignFactory Interface
*/
contract CampaignFactory is ICampaignFactory {

    address public owner;
    ICampaign[] public deployedCampaigns;
    mapping(address => uint) public contractIndex;
    mapping(address => bool) public contractExist;

    //Events
    event newCampaign(address campaignAddress);

    constructor(){
        owner = msg.sender;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function createCampaign(ICampaign.Info memory infoData, ICampaign.Rewards[] memory rewardsData) external override {
        ICampaign _newCampaign = new Campaign(infoData, rewardsData, msg.sender);
        deployedCampaigns.push(_newCampaign);
        contractIndex[address(_newCampaign)] = getLastDeployedCampaignsIndex();
        contractExist[address(_newCampaign)] = true;
        emit newCampaign(address(_newCampaign));
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function deleteCampaign() public override returns (bool){
        require(contractExist[msg.sender], "!Err: Not exist");
        uint _indexToSwap = contractIndex[msg.sender];
        if (_indexToSwap != getLastDeployedCampaignsIndex()) {
            deployedCampaigns[_indexToSwap] = deployedCampaigns[getLastDeployedCampaignsIndex()];
            contractIndex[address(deployedCampaigns[getLastDeployedCampaignsIndex()])] = _indexToSwap;
        }
        deployedCampaigns.pop();
        delete contractIndex[msg.sender];
        delete contractExist[msg.sender];
        return true;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function updateOwner(address newOwner) external override {
        require(owner == msg.sender, "!Not Authorized");
        owner = newOwner;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function getDeployedCampaignsList() external override view returns (ICampaign[] memory){
        return deployedCampaigns;
    }

    /**
     * @notice Helper to get the index of the last campaign deployed
     * @return index uint index of the last elem of the deployedCampaigns array
     */
    function getLastDeployedCampaignsIndex() internal view returns (uint){
        return deployedCampaigns.length - 1;
    }
}
