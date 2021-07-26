// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

contract Campaign is ICampaign {

    bool public isDisabled;
    uint8 public rewardsCounter;
    uint256 public createAt;
    address public manager;
    address public factory;
    WorkflowStatus public status;

    Info private campaignInfo;
    mapping(uint => Rewards) public rewardsList;

    //    Events
    event newCampaign();
    event CampaignNewRewardsAdded(uint rewardsCounter);
    event CampaignInfoUpdated();
    event CampaignRewardsUpdated();
    event CampaignDisabled();
    event CampaignRewardDeleted();
    event CampaignPublished();
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event checkDate(uint deadline, uint currentTime);

    //Modifiers
    modifier isNotDeleted(){
        require(status != WorkflowStatus.CampaignDeleted, "!Err: Campaign Deleted");
        _;
    }

    modifier onlyManager(){
        require(msg.sender == manager, "!Not Authorized");
        _;
    }

    modifier checkStatus(
        WorkflowStatus currentStatus,
        WorkflowStatus requiredStatus
    ) {
        require(currentStatus == requiredStatus, "!Err : Wrong workflow status");
        _;
    }

    constructor(Info memory infoData, Rewards[] memory rewardsData, address _manager)
    {
        require(rewardsData.length > 0, "!Err: Rewards empty");
        require(rewardsData.length <= 10, "!Err: Too much Rewards");
        manager = _manager;
        factory = msg.sender;
        createAt = block.timestamp;
        status = WorkflowStatus.CampaignDrafted;
        _setCampaignInfo(infoData);
        for (rewardsCounter; rewardsCounter < rewardsData.length; rewardsCounter++) {
            _setCampaignReward(rewardsCounter, rewardsData[rewardsCounter]);
        }
    }

    /**
     * @inheritdoc ICampaign
     */
    function getCampaignInfo() external view override isNotDeleted() returns(Info memory, uint, address, WorkflowStatus) {
        return (campaignInfo, createAt, manager, status);
    }

    /**
     * @inheritdoc ICampaign
     */
    function updateCampaign(Info memory newInfo) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        _setCampaignInfo(newInfo);
        emit CampaignInfoUpdated();
    }

    /**
     * @inheritdoc ICampaign
     */
    function addReward(Rewards memory newRewardData) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        rewardsCounter++;
        _setCampaignReward(rewardsCounter, newRewardData);
        emit CampaignNewRewardsAdded(rewardsCounter);
    }

    /**
     * @inheritdoc ICampaign
     */
    function updateReward(Rewards memory newRewardData, uint rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(rewardIndex <= rewardsCounter, "!Err: Index not exist");
        _setCampaignReward(rewardIndex, newRewardData);
        emit CampaignRewardsUpdated();
    }

    /**
    * @notice Internal function that set a new campaign's info and making data validation first.
    * @param data Info Object that contains the Info data following the Info struct
    */
    function _setCampaignInfo(Info memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        require(data.fundingGoal >= 10000, "!Err: Funding Goal not enough");
        require(createAt + 7 days <= data.deadlineDate, "!Err: deadlineDate to short");
        campaignInfo.title = data.title;
        campaignInfo.description = data.description;
        campaignInfo.fundingGoal = data.fundingGoal;
        campaignInfo.deadlineDate = data.deadlineDate;
    }

    /**
     * @notice Internal function that set a new campaign's reward level and making data validation first.
     * @param index uint Index of the reward to add
     * @param data Rewards Object that contains the Reward data following the Rewards struct
     */
    function _setCampaignReward(uint index, Rewards memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        Rewards memory r;
        r.title = data.title;
        r.description = data.description;
        r.minimumContribution = data.minimumContribution;
        r.stockLimit = data.stockLimit;
        r.nbContributors = data.nbContributors;
        r.isStockLimited = data.isStockLimited;
        rewardsList[index] = r;
    }

    /**
     * @inheritdoc ICampaign
     */
    function deleteCampaign() public override isNotDeleted() onlyManager() {
        require(status == WorkflowStatus.CampaignDrafted || status == WorkflowStatus.FundingFailed || status == WorkflowStatus.CampaignCompleted, "!Err : Wrong workflow status");
        status = WorkflowStatus.CampaignDeleted;
        ICampaignFactory(factory).deleteCampaign();
        emit CampaignDisabled();
    }

    /**
     * @inheritdoc ICampaign
     */
    function deleteReward(uint256 rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(rewardIndex <= rewardsCounter, "!Err: Index not exist");
        if(rewardsCounter!=rewardIndex){
            rewardsList[rewardIndex] = rewardsList[rewardsCounter];
        }
        delete rewardsList[rewardsCounter];
        rewardsCounter--;
        emit CampaignRewardDeleted();
    }

    /**
     * @inheritdoc ICampaign
     */
    function updateManager(address newManager) external override onlyManager() {
        manager = newManager;
    }

    /**
     * @inheritdoc ICampaign
     */
    function publishCampaign() external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        uint minDate = campaignInfo.deadlineDate - 7 days;
        require(minDate >= block.timestamp, "!Err: deadlineDate to short");
        status = WorkflowStatus.CampaignPublished;
        emit WorkflowStatusChange(WorkflowStatus.CampaignDrafted, WorkflowStatus.CampaignPublished);
        emit checkDate(minDate, block.timestamp);
        emit CampaignPublished();
    }
}
