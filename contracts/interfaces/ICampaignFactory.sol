// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "../interfaces/ICampaign.sol";

/**
* @title ICampaignFactory
* @notice The Campaign factory facilitate the storage of campaign addresses
* @dev Interface for the CampaignFactory contract
*/
interface ICampaignFactory {

    /**
     * @notice Add campaign contract address to mapping
     * @param _newCampaign The address of the campaign created from the campaignCreator
     */
    function addCampaign(ICampaign _newCampaign) external;

    /**
     * @notice Deploy the proposal contract for a campaign.
     * @param _manager The campaign manager address.
     * @dev Can only be called by an existing campaign contract.
     */
    function deployProposalContract(address _manager) external;

    /**
     * @notice Delete a new Campaign that call this function.
     * @dev Only an contract already deployed must be able to call this function
     */
    function deleteCampaign() external;

    /**
     * @notice Allow the owner to set a new owner for the factory.
     * @dev Only the actual owner must be able to call this function
     * @param _newOwner The new owner address
     */
    function updateOwner(address _newOwner) external;

    /**
     * @notice Allow the owner to set campaignCreator contract address.
     * @dev Only the actual owner must be able to call this function
     * @param _campaignCreatorContract The campaignCreator contract address
     */
    function setCampaignCreator(address _campaignCreatorContract) external;
}
