// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;
pragma abicoder v2;

import "./interfaces/ICampaign.sol";

contract Campaign is ICampaign {
//    struct Rewards {
//        string title;
//        string description;
//        bool isStockLimited;
//        uint256 stockLimit;
//        uint256 nbContributors;

//        mapping(address => uint) contributorsList;
//    }
//
//    struct  Info  {
//        string title;
//        string description;
//        uint256 fundingGoal;
//        uint256 durationDays;
//    }

    uint256 public createAt;
    uint256 public lastUpdatedAt;
    address public manager;
    bool public isDisabled;
    Info public campaignInfo;
    Rewards[] public rewardsList;

    //    Events
    event CampaignInfoUpdated();
    event newCampaign();
    event CampaignDisabled();

    //Modifiers
    modifier isNotDisabled(){
        require(!isDisabled, "!Err: Disabled");
        _;
    }

    modifier onlyManager(){
        require(msg.sender == manager, "!Not Authorized");
        _;
    }

    constructor(Info memory infoData, Rewards[] memory rewardsData)
    {
        require(rewardsData.length>0,"!Err: Rewards empty");
        manager = msg.sender;
        createAt = block.timestamp;
        _setCampaignInfo(infoData);
//        _setCampaignReward(rewardsData[0]);
        for(uint8 i=0;i<rewardsData.length;i++){
            _setCampaignReward(rewardsData[i]);
        }
        emit newCampaign();
    }

    function updateAllInfoData(Info memory updatedInfoData) external override isNotDisabled() onlyManager() {
        _setCampaignInfo(updatedInfoData);
        emit CampaignInfoUpdated();
    }

    function _setCampaignInfo(Info memory data) private {
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        require(data.fundingGoal >= 100, "!Err: Funding Goal not enough");
        require(createAt + data.durationDays * 1 days >= block.timestamp + 7 days, "!Err: durationDays to short");
        campaignInfo.title = data.title;
        campaignInfo.description = data.description;
        campaignInfo.fundingGoal = data.fundingGoal;
        campaignInfo.durationDays = data.durationDays;
    }

    function _setCampaignReward(Rewards memory data) private{
        require(bytes(data.title).length > 0, "!Err: Title empty");
        require(bytes(data.description).length > 0, "!Err: Description empty");
        Rewards memory r;
        r.title=data.title;
        r.description=data.description;
        r.minimumContribution=data.minimumContribution;
        r.stockLimit=data.stockLimit;
        r.nbContributors=data.nbContributors;
        r.isStockLimited=data.isStockLimited;
        rewardsList.push(r);
//        rewardsList.push(Rewards(data.title,data.description,data.minimumContribution,data.stockLimit,data.nbContributors,data.isStockLimited));
    }

    function deleteCampaign() external override isNotDisabled() onlyManager() {
        isDisabled = true;
        emit CampaignDisabled();
    }

    function updateManager(address newManager) external override onlyManager() {
        manager = newManager;
    }

    function getRewardsList() external view returns(Rewards[] memory){
        return rewardsList;
    }

}
