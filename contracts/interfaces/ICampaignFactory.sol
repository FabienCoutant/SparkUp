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
     * @notice Add campaign contract address to mapping
     * @param _newCampaign is ICampaign of created campaign from proxy
     */
    function addCampaign(ICampaign _newCampaign) external;

    /**
     * @notice Delete a new proposal contract.
     * @param _manager is campaign manager.
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
     * @param newOwner address The new owner address
     */
    function updateOwner(address newOwner) external;

    /**
     * @notice Allow the owner to set ProxyContract address.
     * @dev Only the actual owner must be able to call this function
     * @param _proxyContract address the ProxyContract
     */
    function setProxy(address _proxyContract) external;
}
