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
contract ProxyFactory {
    
    address public immutable factory;
    address public immutable escrow;
    ICampaignFactory immutable factoryContract;
    IERC20 public immutable usdcToken;

    //Events
    event newCampaign(address campaignAddress);
    
    constructor(address _factoryContract, address _escrowContract, address _usdcToken) {
        factory = _factoryContract;
        factoryContract = ICampaignFactory(_factoryContract);
        escrow = _escrowContract;
        usdcToken = IERC20(_usdcToken);
    }
    
    function createCampaign(ICampaign.Info memory infoData, ICampaign.Rewards[] memory rewardsData) external {
        ICampaign _newCampaign = new Campaign(infoData, rewardsData, msg.sender, usdcToken, escrow, factory);
        factoryContract.addCampaign(_newCampaign);
        emit newCampaign(address(_newCampaign));
    }
}
