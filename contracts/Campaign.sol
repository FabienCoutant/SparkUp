// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";
import "./interfaces/IProposal.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Campaign is ICampaign {
    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdcToken;

    uint8 public rewardsCounter;
    uint64 public createAt;
    uint128 public totalRaised;

    address public manager;
    address public factory;
    address public proposal;
    address public immutable escrowContract;

    WorkflowStatus public status;

    Info private campaignInfo;

    mapping(uint8 => Rewards) public rewardsList;
    mapping(uint8 => mapping(address => uint8)) public rewardToContributor;
    mapping(address => uint128) public contributorBalances;

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

    constructor(Info memory infoData, Rewards[] memory rewardsData, address _manager, IERC20 _usdcToken, address _escrowContract, address _factory)
    {
        require(rewardsData.length > 0, "!Err: Rewards empty");
        require(rewardsData.length <= 10, "!Err: Too much Rewards");
        manager = _manager;
        factory = _factory;
        createAt = uint64(block.timestamp);
        status = WorkflowStatus.CampaignDrafted;
        usdcToken = _usdcToken;
        escrowContract = _escrowContract;
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
    function getCampaignInfo() external view override isNotDeleted() returns(Info memory, uint64, address, WorkflowStatus, uint128, address) {
        return (campaignInfo, createAt, manager, status, totalRaised, proposal);
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
    function updateReward(Rewards memory newRewardData, uint8 rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
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
        require(data.fundingGoal >= 1000 ether, "!Err: Funding Goal not enough");
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
    function _setCampaignReward(uint8 index, Rewards memory data) private {
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
    function deleteReward(uint8 rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
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
    function contribute(uint128 _amount, uint8 rewardIndex) external override isNotDeleted() checkCampaignDeadline() {
        require(status != WorkflowStatus.CampaignDrafted && status != WorkflowStatus.FundingFailed && status != WorkflowStatus.CampaignCompleted, "!Err : Wrong workflow status");
        require(checkRewardInventory(rewardIndex), "!Err: no more reward");
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        contributorBalances[msg.sender] = contributorBalances[msg.sender] + _amount;
        rewardToContributor[rewardIndex][msg.sender] = rewardToContributor[rewardIndex][msg.sender] + 1;
        rewardsList[rewardIndex].nbContributors = rewardsList[rewardIndex].nbContributors + 1;
        rewardsList[rewardIndex].amount = rewardsList[rewardIndex].amount + _amount;
        if(getContractUSDCBalance() >= campaignInfo.fundingGoal) {
            status = WorkflowStatus.FundingComplete;
        }
    }

    /**
     * @inheritdoc ICampaign
     */
    function refund() external override {
        require(block.timestamp > campaignInfo.deadlineDate && getContractUSDCBalance() > 0, "!Err: conditions not met");
        require(status == WorkflowStatus.CampaignPublished || status == WorkflowStatus.FundingFailed, "!Err: wrong workflowstatus");
        if (status == WorkflowStatus.CampaignPublished) {
            status = WorkflowStatus.FundingFailed;
        }
        uint128 _balance = contributorBalances[msg.sender];
        delete contributorBalances[msg.sender];
        usdcToken.safeTransfer(msg.sender, _balance);
    }

    /**
     * @inheritdoc ICampaign
     */
    function launchProposalContract() external override onlyManager() isNotDeleted() checkStatus(status, WorkflowStatus.FundingComplete) {
        require(proposal == address(0), "!Err: proposal already deployed");
        require(block.timestamp > campaignInfo.deadlineDate, "!Err: campaign deadline not passed");
        usdcToken.safeTransfer(escrowContract, getContractUSDCBalance()*5/100);
        totalRaised = getContractUSDCBalance();
        ICampaignFactory(factory).deployProposalContract(manager);
    }

    /**
     * @inheritdoc ICampaign
     */
    function setProposal(address _proposalContract) external override {
        require(msg.sender == factory, "!Not Authorized");
        proposal = _proposalContract;
    } 

    /**
     * @inheritdoc ICampaign
     */
    function releaseProposalFunds(uint128 _amount) external override {
        require(msg.sender == proposal, "!Err: Access denied");
        usdcToken.safeTransfer(manager, _amount);
    }

    /**
     * @notice Return the amount in USDC raised by the campaign
     * @dev amount uint USDC raised by the campaign in WEI
     */
    function getContractUSDCBalance() public view returns(uint128) {
        return uint128(usdcToken.balanceOf(address(this)));
    }


    function checkRewardInventory(uint8 rewardIndex) internal view returns (bool) {
        if (!rewardsList[rewardIndex].isStockLimited) {
            return true;
        } else if(rewardsList[rewardIndex].stockLimit > rewardsList[rewardIndex].nbContributors) {
            return true;
        } else {
            return false;
        }
    }
}
