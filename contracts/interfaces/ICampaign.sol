// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

interface ICampaign {
    struct Rewards {
        string title;
        string description;
        uint256 minimumContribution;
        uint256 amount;
        uint256 stockLimit;
        uint256 nbContributors;
        bool isStockLimited;
//        mapping(address => uint) contributorsList;
    }

    struct Info {
        string title;
        string description;
        uint256 fundingGoal;
        uint256 durationDays;
    }

    function updateAllInfoData(Info memory updatedInfoData) external;

//    function setReward(uint256 rewardIndex, Rewards memory newRewardData) public;
//
//    function updateAllRewardsData(uint256 rewardIndex, Rewards[] memory newRewardsData) external;

    function deleteCampaign() external;

    function updateManager(address newManager) external;

}
