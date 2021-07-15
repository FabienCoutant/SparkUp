// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "../interfaces/ICampaign.sol";

interface ICampaignFactory {

    function createCampaign(ICampaign.Info memory infoData,ICampaign.Rewards[] memory rewardsData) external;

    function deleteCampaign() external returns(bool);

    function updateOwner() external;

}
