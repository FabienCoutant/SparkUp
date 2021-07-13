// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "../Campaign.sol";
interface ICampaignFactory {

    function createCampaign(Campaign.Info memory campaignData) external;

    function deleteCampaign() external;

    function updateManager(address _newManager) external;


}
