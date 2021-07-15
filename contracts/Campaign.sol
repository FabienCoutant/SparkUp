// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma abicoder v2;

import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

contract Campaign is ICampaign {

    uint256 public createAt;
    uint256 public lastUpdatedAt;
    address public manager;
    address public factory;
    bool public isDisabled;

    Info public campaignInfo;
    mapping(uint => Rewards) public rewardsList;
    uint256 public rewardsCounter;


    //    Events
    event newCampaign();
    event CampaignNewRewardsAdded(uint rewardsCounter);
    event CampaignInfoUpdated();
    event CampaignRewardsUpdated();
    event CampaignDisabled();
    event CampaignRewardDeleted();

    //Modifiers
    modifier isNotDisabled(){
        require(!isDisabled, "!Err: Disabled");
        _;
    }

    modifier onlyManager(){
        require(msg.sender == manager, "!Not Authorized");
        _;
    }

    constructor(Info memory infoData, Rewards[] memory rewardsData, address _manager)
    {
        require(rewardsData.length > 0, "!Err: Rewards empty");
        manager = _manager;
        factory = msg.sender;
        createAt = block.timestamp;
        _setCampaignInfo(infoData);
        for (rewardsCounter; rewardsCounter < rewardsData.length; rewardsCounter++) {
            _setCampaignReward(rewardsCounter, rewardsData[rewardsCounter]);
        }
    }

    function updateAllInfoData(Info memory updatedInfoData) external override isNotDisabled() onlyManager() {
        _setCampaignInfo(updatedInfoData);
        emit CampaignInfoUpdated();
    }

    function addReward(Rewards memory newRewardData) external override isNotDisabled() onlyManager() {
        rewardsCounter++;
        _setCampaignReward(rewardsCounter, newRewardData);
        emit CampaignNewRewardsAdded(rewardsCounter);
    }

    function updateAllRewardsData(Rewards[] memory updatedRewardsData) external override isNotDisabled() onlyManager {
        require(updatedRewardsData.length > 0, "!Err: Rewards empty");
        for (uint i = 0; i < rewardsCounter; i++) {
            delete rewardsList[i];
        }
        rewardsCounter = 0;
        for (rewardsCounter; rewardsCounter < updatedRewardsData.length; rewardsCounter++) {
            _setCampaignReward(rewardsCounter, updatedRewardsData[rewardsCounter]);
        }
        emit CampaignRewardsUpdated();
    }

    function updateRewardData(Rewards memory newRewardData, uint rewardIndex) external override isNotDisabled() onlyManager() {
        require(rewardIndex <= rewardsCounter, "!Err: Index not exist");
        _setCampaignReward(rewardIndex, newRewardData);
        emit CampaignRewardsUpdated();
    }

    function _setCampaignInfo(Info memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        require(data.fundingGoal >= 10000, "!Err: Funding Goal not enough");
        require(createAt + data.durationDays * 1 days >= block.timestamp + 7 days, "!Err: durationDays to short");
        campaignInfo.title = data.title;
        campaignInfo.description = data.description;
        campaignInfo.fundingGoal = data.fundingGoal;
        campaignInfo.durationDays = data.durationDays;
    }

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

    function deleteCampaign() external override isNotDisabled() onlyManager() {
        isDisabled = true;
        ICampaignFactory(factory).deleteCampaign();
        emit CampaignDisabled();
    }

    function deleteReward(uint256 rewardIndex) external override isNotDisabled() onlyManager() {
        require(rewardIndex <= rewardsCounter, "!Err: Index not exist");
        if(rewardsCounter!=rewardIndex){
            rewardsList[rewardIndex] = rewardsList[rewardsCounter];
        }
        delete rewardsList[rewardsCounter];
        rewardsCounter--;
        emit CampaignRewardDeleted();
    }

    function updateManager(address newManager) external override onlyManager() {
        manager = newManager;
    }

    function updateFactory(address newFactory) external {
        require(factory == msg.sender, "!Err: Not Factory Contract");
        factory = newFactory;
    }
}
