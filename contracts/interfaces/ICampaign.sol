// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

/**
* @title ICampaign
* @notice The Campaign contract handle the all life of one Campaign. It's generate by the CampaignFactory.
* @dev Interface for the Campaign contract
*/
interface ICampaign {

    struct Rewards {
        string title;
        string description;
        uint256 minimumContribution;
        uint256 amount;
        uint256 stockLimit;
        uint256 nbContributors;
        bool isStockLimited;
    }

    struct Info {
        string title;
        string description;
        uint256 fundingGoal;
        uint256 deadlineDate;
    }

    enum WorkflowStatus {
        CampaignDrafted,
        CampaignPublished,
        FundingComplete,
        FundingFailed,
        CampaignCompleted,
        CampaignDeleted
    }

    /**
     * @notice Returns the campaign information in the struct Info plus de createAt and the managerAddress.
     */
    function getCampaignInfo() external returns(Info memory, uint, address);

    /**
     * @notice Update the campaign information in the struct Info.
     * @dev Only the manager must be able to call it.
     * @param updatedInfoData Info Object that contains all the new information following the Info struct for the campaign
     */
    function updateCampaign(Info memory updatedInfoData) external;

    /**
     * @notice Add a new reward level to the campaign.
     * @dev Only the manager must be able to call it.
     * @param newRewardData Rewards Object that contains all the needed information following the Rewards struct for the campaign
     */
    function addReward(Rewards memory newRewardData) external;

    /**
     * @notice Update the data of a specific reward regarding its id.
     * @dev Only the manager must be able to call it.
     * @param newRewardData Rewards Object that contains the new data to set following the Rewards struct for the campaign
     * @param rewardIndex uint256 Index of the reward to update
     */
    function updateReward( Rewards memory newRewardData,uint256 rewardIndex) external;

    /**
     * @notice Delete a reward by its Id.
     * @dev Only the manager must be able to call it.
     * @param rewardIndex uint256 Index of the reward to delete
     */
    function deleteReward(uint256 rewardIndex) external;

    /**
     * @notice Delete the campaign.
     * @dev It's the entry point for deleting a campaign. Only the manager must be able to call it
     */
    function deleteCampaign() external;

    /**
     * @notice Allow the manager to setup a new one.
     * @dev Only the manager must be able to call it.
     * @param newManager address Address of the new manager
     */
    function updateManager(address newManager) external;

    /**
     * @notice Allow the factory to setup a new one in case of migration.
     * @dev Used for mainly for pointing the right factory during the deletion
     * @param newFactory address Address of the new factory
     */
    function updateFactory(address newFactory) external;

    function publishCampaign() external;
}
