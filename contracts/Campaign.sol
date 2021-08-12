// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";
import "./interfaces/IProposal.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
* @title Campaign
* @notice The Campaign contract handle the all life for one campaign
* @dev Inherit of for the Campaign Interface
*/
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
        WorkflowStatus _currentStatus,
        WorkflowStatus _requiredStatus
    ) {
        require(_currentStatus == _requiredStatus, "!Err : Wrong workflow status");
        _;
    }
    
    modifier checkCampaignDeadline() {
        require(block.timestamp <  campaignInfo.deadlineDate, "!Err : Campaign contribution has ended");
        _;
    }

    constructor(Info memory _infoData, Rewards[] memory _rewardsData, address _manager, IERC20 _usdcToken, address _escrowContract, address _factory)
    {
        require(_rewardsData.length > 0, "!Err: Rewards empty");
        require(_rewardsData.length <= 10, "!Err: Too much Rewards");
        manager = _manager;
        factory = _factory;
        createAt = uint64(block.timestamp);
        status = WorkflowStatus.CampaignDrafted;
        usdcToken = _usdcToken;
        escrowContract = _escrowContract;
        _setCampaignInfo(_infoData);
        uint8 _rewardsCounter;
        for (_rewardsCounter; _rewardsCounter < _rewardsData.length; _rewardsCounter++) {
            _setCampaignReward(_rewardsCounter, _rewardsData[_rewardsCounter]);
        }
        rewardsCounter = uint8(_rewardsData.length) ;
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
    function updateCampaign(Info memory _newInfo) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        _setCampaignInfo(_newInfo);
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
    function updateReward(Rewards memory _newRewardData, uint8 _rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(_rewardIndex <= rewardsCounter, "!Err: Index not exist");
        _setCampaignReward(_rewardIndex, _newRewardData);
    }

    /**
    * @notice Internal function that set a new campaign's info and making data validation first.
    * @param _data The Info Object that contains the Info data which follow the Info struct
    */
    function _setCampaignInfo(Info memory _data) private {
        require(bytes(_data.title).length > 0, "!Err: Title empty");
        require(bytes(_data.description).length > 0, "!Err: Description empty");
        require(_data.fundingGoal >= 1000*10**6, "!Err: Funding Goal not enough");
        require(createAt + 7 days <= _data.deadlineDate, "!Err: deadlineDate to short");
        campaignInfo.title = _data.title;
        campaignInfo.description = _data.description;
        campaignInfo.fundingGoal = _data.fundingGoal;
        campaignInfo.deadlineDate = _data.deadlineDate;
    }

    /**
     * @notice Internal function that set a new campaign's reward level and making data validation first.
     * @param _index The reward's index to add
     * @param _data The Rewards Object that contains the Reward data which follow the Rewards struct
     */
    function _setCampaignReward(uint8 _index, Rewards memory _data) private {
        require(bytes(_data.title).length > 0, "!Err: Title empty");
        require(bytes(_data.description).length > 0, "!Err: Description empty");
        Rewards memory r;
        r.title = _data.title;
        r.description = _data.description;
        r.minimumContribution = _data.minimumContribution;
        r.stockLimit = _data.stockLimit;
        r.nbContributors = _data.nbContributors;
        r.isStockLimited = _data.isStockLimited;
        rewardsList[_index] = r;
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
    function deleteReward(uint8 _rewardIndex) external override isNotDeleted() onlyManager() checkStatus(status, WorkflowStatus.CampaignDrafted) {
        require(_rewardIndex < rewardsCounter, "!Err: Index not exist");
        if((rewardsCounter-1)!=_rewardIndex){
            rewardsList[_rewardIndex] = rewardsList[rewardsCounter-1];
        }
        delete rewardsList[rewardsCounter-1];
        rewardsCounter--;
    }

    /**
     * @inheritdoc ICampaign
     */
    function updateManager(address _newManager) external override onlyManager() {
        manager = _newManager;
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
    function contribute(uint128 _amount, uint8 _rewardIndex) external override isNotDeleted() checkCampaignDeadline() {
        require(status != WorkflowStatus.CampaignDrafted && status != WorkflowStatus.FundingFailed && status != WorkflowStatus.CampaignCompleted, "!Err : Wrong workflow status");
        require(_amount >= rewardsList[_rewardIndex].minimumContribution, "!Err: amount not enough");
        require(checkRewardInventory(_rewardIndex), "!Err: no more reward");
        usdcToken.safeTransferFrom(msg.sender, address(this), _amount);
        contributorBalances[msg.sender] = contributorBalances[msg.sender] + _amount;
        rewardToContributor[_rewardIndex][msg.sender] = rewardToContributor[_rewardIndex][msg.sender] + 1;
        rewardsList[_rewardIndex].nbContributors = rewardsList[_rewardIndex].nbContributors + 1;
        rewardsList[_rewardIndex].amount = rewardsList[_rewardIndex].amount + _amount;
        if(_campaignUSDCBalance() >= campaignInfo.fundingGoal) {
            status = WorkflowStatus.FundingComplete;
        }
    }

    /**
     * @inheritdoc ICampaign
     */
    function refund() external override {
        require(block.timestamp > campaignInfo.deadlineDate && _campaignUSDCBalance() > 0, "!Err: conditions not met");
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
        usdcToken.safeTransfer(escrowContract, _campaignUSDCBalance()*5/100);
        totalRaised = _campaignUSDCBalance();
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
     * @inheritdoc ICampaign
     */
    function getContractUSDCBalance() external override view returns(uint128) {
        return _campaignUSDCBalance();
    }

    /**
     * @notice Internal function that return the amount in USDC raised by the campaign
     * @dev Note that USDC using 6 decimals instead of 18
     * @return balance The current balance of the current contract
     */
    function _campaignUSDCBalance() private view returns(uint128){
        return uint128(usdcToken.balanceOf(address(this)));
    }

    /**
     * @notice Return true if reward inventory > 0 and false if = 0
     * @dev If the reward if not limited the function return true
     * @param _rewardIndex The reward's index to check
     * @return bool The return of the check
     */
    function checkRewardInventory(uint8 _rewardIndex) internal view returns (bool) {
        if (!rewardsList[_rewardIndex].isStockLimited) {
            return true;
        } else if(rewardsList[_rewardIndex].stockLimit > rewardsList[_rewardIndex].nbContributors) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @inheritdoc ICampaign
     */
    function getContributorBalances(address _account) external view override returns(uint128){
        return contributorBalances[_account];
    }

}
