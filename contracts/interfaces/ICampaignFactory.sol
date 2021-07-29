// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "../interfaces/ICampaign.sol";

/**
* @title ICampaignFactory
* @notice The Campaign factory facilitate the deployment of new campaigns
* @dev Interface for the CampaignFactory contract
*/
interface ICampaignFactory {

    /**
     * @notice Create a new Campaign contract and init it
     * @param infoData ICampaign.Info basic information for a campaign following the Campaign Info structure
     * @param rewardsData ICampaign.Rewards array of rewards information for a campaign following the Campaign Info structure
     */
    function createCampaign(ICampaign.Info memory infoData,ICampaign.Rewards[] memory rewardsData) external;

    /**
     * @notice Delete a new Campaign that call this function.
     * @dev Only an contract already deployed must be able to call this function
     * @return success bool
     */
    function deleteCampaign() external returns(bool);

    /**
     * @notice Allow the owner to set a new owner for the factory.
     * @dev Only the actual owner must be able to call this function
     * @param newOwner address The new owner address
     */
    function updateOwner(address newOwner) external;

    /**
     * @notice Allow to get the all list of campaign address deployed
     * @return Campaigns ICampaign[] list of campaigns address deployed and still actives
     */
    function getDeployedCampaignsList() external view returns (ICampaign[] memory);
}
