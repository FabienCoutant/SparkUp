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
        bool isStockLimited;
        uint16 stockLimit;
        uint64 nbContributors;
        uint128 minimumContribution;
        uint128 amount;
    }

    struct Info {
        string title;
        string description;
        uint64 deadlineDate;
        uint128 fundingGoal;
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
     * @return Info The campaign Info data set
     * @return createAt The campaign creation date in timestamps
     * @return manager The address of the campaign manager
     * @return WorkflowStatus The workflow status of the campaign
     * @return totalRaised The amount raised by the campaign in USDC
     * @return proposalAddress The address of the proposal contract link to the campaign
     */
    function getCampaignInfo() external returns(Info memory, uint64, address, WorkflowStatus, uint128, address);

    /**
     * @notice Update the campaign information in the struct Info.
     * @dev Only the manager must be able to call it.
     * @param _updatedInfoData is The Info Object that contains all the new information following the Info struct for the campaign
     */
    function updateCampaign(Info memory _updatedInfoData) external;

    /**
     * @notice Add a new reward level to the campaign.
     * @dev Only the manager must be able to call it.
     * @param _newRewardData The Rewards Object that contains all the needed information which follow the Rewards struct for the campaign
     */
    function addReward(Rewards memory _newRewardData) external;

    /**
     * @notice Update the data of a specific reward regarding its id.
     * @dev Only the manager must be able to call it.
     * @param _newRewardData The rewards Object that contains the new data to set which follow the Rewards struct for the campaign
     * @param _rewardIndex The reward's index to update
     */
    function updateReward( Rewards memory _newRewardData,uint8 _rewardIndex) external;

    /**
     * @notice Delete a reward by its Id.
     * @dev Only the manager must be able to call it.
     * @param _rewardIndex The reward's index to delete
     */
    function deleteReward(uint8 _rewardIndex) external;

    /**
     * @notice Delete the campaign.
     * @dev It's the entry point for deleting a campaign. Only the manager must be able to call it
     */
    function deleteCampaign() external;

    /**
     * @notice Allow the manager to setup a new one.
     * @dev Only the manager must be able to call it.
     * @param _newManager The new manager's address
     */
    function updateManager(address _newManager) external;
    
    /**
     * @notice Allow the manager to publish campaign and make it visible to potential contributors.
     * @dev Only the manager must be able to call it and only within acceptable deadlineDate timeframe.
     */
    function publishCampaign() external;
    
    /**
     * @notice Allow contributors to contribute to the campaign.
     * @dev Can only be called if campaign is published, is not completed, is not deleted and is not failed.
     * @param _amount The Amount in USDC that msg.sender want to contribute
     * @param _rewardIndex The reward's index
     */
    function contribute(uint128 _amount, uint8 _rewardIndex) external;

    /**
     * @notice Allow contributor to get refunded.
     * @dev Can only be called if campaign deadline is passed and fundingGoal not reached.
     */
    function refund() external;

    /**
     * @notice Allows manager to deploy proposal contract to start submitting proposals.
     * @dev Can only be called by manager and if WorkflowStatus is FundingComplete.
     */
    function launchProposalContract() external;

    /**
     * @notice Allows campaign factory contract to set proposal contract address.
     * @dev Can only be called by campaign factory contract.
     * @param _proposalContract The proposal contract's address
     */
    function setProposal(address _proposalContract) external;

    /**
     * @notice Transfer unlocked funds to manager address.
     * @dev Can only be called by proposal contract when proposal is accepted.
     * @param _amount The Amount of funding raised that must be transfer to the manager
     */
    function releaseProposalFunds(uint128 _amount) external;

    /**
     * @notice Return the contribution balance in usdc for a specific address
     * @param _account The contributor's address
     * @return Amount The Amount contributed by the _account
     */
    function getContributorBalances(address _account) external view returns(uint128);

    /**
     * @notice Make _campaignUSDCBalance available to external and used by Interface
     * @dev Note that USDC using 6 decimals instead of 18
     * @return balance The current balance of the current contract
     */
    function getContractUSDCBalance() external view returns(uint128);
}
