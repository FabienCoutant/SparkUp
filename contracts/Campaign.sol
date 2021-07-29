// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Campaign is ICampaign {
    using SafeMath for uint256;
    
    uint8 public rewardsCounter;
    uint256 public createAt;
    address public manager;
    address public factory;
    WorkflowStatus public status;
    IERC20 public immutable usdcToken;

    Info private campaignInfo;
    mapping(uint => Rewards) public rewardsList;
    mapping(uint => mapping(address => uint)) public rewardToContributor;
    mapping(address => uint256) public contributorBalances;

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
    
    modifier checkCampaignDeadline() {
        require(block.timestamp <  campaignInfo.deadlineDate, "!Err : Campaign contribution has ended");
        _;
    }

    constructor(Info memory infoData, Rewards[] memory rewardsData, address _manager, IERC20 _usdcToken)
    {
        require(rewardsData.length > 0, "!Err: Rewards empty");
        require(rewardsData.length <= 10, "!Err: Too much Rewards");
        manager = _manager;
        factory = msg.sender;
        createAt = block.timestamp;
        status = WorkflowStatus.CampaignDrafted;
        usdcToken = _usdcToken;
        _setCampaignInfo(infoData);
        uint8 _rewardsCounter;
        for (_rewardsCounter; _rewardsCounter < rewardsData.length; _rewardsCounter++) {
            _setCampaignReward(_rewardsCounter, rewardsData[_rewardsCounter]);
        }
        rewardsCounter = uint8(rewardsData.length) ;
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
    }

    /**
     * @inheritdoc ICampaign
     */
    function addReward(Rewards memory newRewardData) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        _setCampaignReward(rewardsCounter, newRewardData);
        rewardsCounter++;
    }

    /**
     * @inheritdoc ICampaign
     */
    function updateReward(Rewards memory newRewardData, uint rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(rewardIndex <= rewardsCounter, "!Err: Index not exist");
        _setCampaignReward(rewardIndex, newRewardData);
    }

    /**
    * @notice Internal function that set a new campaign's info and making data validation first.
    * @param data Info Object that contains the Info data following the Info struct
    */
    function _setCampaignInfo(Info memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        require(data.fundingGoal >= 10000 ether, "!Err: Funding Goal not enough");
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
    }

    /**
     * @inheritdoc ICampaign
     */
    function deleteReward(uint256 rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(rewardIndex < rewardsCounter, "!Err: Index not exist");
        if((rewardsCounter-1)!=rewardIndex){
            rewardsList[rewardIndex] = rewardsList[rewardsCounter-1];
        }
        delete rewardsList[rewardsCounter-1];
        rewardsCounter--;
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
    }
    
    /**
     * @inheritdoc ICampaign
     */
    function contribute(uint256 _amount, uint8 rewardIndex) external override isNotDeleted() checkCampaignDeadline() {
        require(status != WorkflowStatus.CampaignDrafted && status != WorkflowStatus.FundingFailed && status != WorkflowStatus.CampaignCompleted, "!Err : Wrong workflow status");
        SafeERC20.safeTransferFrom(usdcToken, msg.sender, address(this), _amount);
        contributorBalances[msg.sender] = contributorBalances[msg.sender].add(_amount);
        rewardToContributor[rewardIndex][msg.sender] = rewardToContributor[rewardIndex][msg.sender].add(1);
        rewardsList[rewardIndex].nbContributors = rewardsList[rewardIndex].nbContributors.add(1);
        rewardsList[rewardIndex].amount = rewardsList[rewardIndex].amount.add(_amount);
        if(getContractUSDCBalance() >= campaignInfo.fundingGoal) {
            status = WorkflowStatus.FundingComplete;
        }
    }
    
    function getContractUSDCBalance() public view returns(uint) {
        return usdcToken.balanceOf(address(this));
    }
}
