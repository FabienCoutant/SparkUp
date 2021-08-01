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

    uint128 public campaignCounter = 1;
    address public owner;

    mapping(uint128 => address) public deployedCampaigns;
    mapping(address => uint128) public campaignToId;
    IERC20 public immutable usdcToken;
    address public immutable escrowContract;

    //Events
    event newCampaign(address campaignAddress);

    constructor(address _usdcToken, address _escrowContract){
        owner = msg.sender;
        usdcToken = IERC20(_usdcToken);
        escrowContract = _escrowContract;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function createCampaign(ICampaign.Info memory infoData, ICampaign.Rewards[] memory rewardsData) external override {
        ICampaign _newCampaign = new Campaign(infoData, rewardsData, msg.sender, usdcToken, escrowContract);
        deployedCampaigns[campaignCounter] = address(_newCampaign);
        campaignToId[address(_newCampaign)] = campaignCounter;
        campaignCounter++;
        emit newCampaign(address(_newCampaign));
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function deleteCampaign() public override {
        require(campaignToId[msg.sender] !=0 , "!Err: Not exist");
        uint128 _indexToSwap = campaignToId[msg.sender];
        if (_indexToSwap != campaignCounter - 1) {
            deployedCampaigns[_indexToSwap] = deployedCampaigns[campaignCounter - 1];
            campaignToId[deployedCampaigns[campaignCounter-1]] = _indexToSwap;
        }

        delete deployedCampaigns[campaignCounter - 1];
        delete campaignToId[msg.sender];
        campaignCounter--;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function updateOwner(address newOwner) external override {
        require(owner == msg.sender, "!Not Authorized");
        owner = newOwner;
    }
}
