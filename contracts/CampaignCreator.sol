// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./Campaign.sol";
import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

/**
* @title CampaignCreator
* @notice The CampaignCreator is used for the deployment of new campaign
* @dev Using this Contract make the CampaignFactory contract lighter
*/
contract CampaignCreator {
    
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

    /**
    * @notice Deploy a new campaign contract and push it address to the Campaign Factory contract
    * @dev The function emit an event that return the address to the DApp for state update
    * @param _infoData The Info Object that contains data which follow the ICampaign.Info struct
    * @param _rewardsData The array of Rewards Object that contains data which follow the ICampaign.Rewards struct
    */
    function createCampaign(ICampaign.Info memory _infoData, ICampaign.Rewards[] memory _rewardsData) external {
        ICampaign _newCampaign = new Campaign(_infoData, _rewardsData, msg.sender, usdcToken, escrow, factory);
        factoryContract.addCampaign(_newCampaign);
        emit newCampaign(address(_newCampaign));
    }
}
