// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma abicoder v2;

import "./Campaign.sol";

contract CampaignFactory {

    address owner;

    event newCampaign();

    constructor(){
        owner = msg.sender;
    }

    function createCampaign(Campaign.Info memory infoData,Campaign.Rewards[] memory rewardsData) external{
        new Campaign(infoData,rewardsData);
        emit newCampaign();
    }

    function updateOwner() external{
        require(owner==msg.sender);
        owner=msg.sender;
    }
}
