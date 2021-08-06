// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import "./Proposal.sol";
import "./interfaces/IProposal.sol";
import "./interfaces/ICampaign.sol";
import "./interfaces/ICampaignFactory.sol";

/**
* @title CampaignFactory
* @notice The Campaign factory is used for save the list of campaign deployed and also deploy proposal contract
* @dev Inherit of for the CampaignFactory Interface
*/
contract CampaignFactory is ICampaignFactory {

    uint128 public campaignCounter = 1;
    address public owner;
    address public campaignCreatorContract;

    mapping(uint128 => address) public deployedCampaigns;
    mapping(address => uint128) public campaignToId;

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "!Not Authorized");
        _;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function addCampaign(ICampaign _newCampaign) external override {
        require(msg.sender == campaignCreatorContract, "!Not Authorized");
        deployedCampaigns[campaignCounter] = address(_newCampaign);
        campaignToId[address(_newCampaign)] = campaignCounter;
        campaignCounter++;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function deleteCampaign() public override {
        require(campaignToId[msg.sender] !=0 , "!Err: Not exist");
        uint128 _indexToSwap = campaignToId[msg.sender];
        if (_indexToSwap != campaignCounter - 1) {
            deployedCampaigns[_indexToSwap] = deployedCampaigns[campaignCounter - 1];
            campaignToId[deployedCampaigns[campaignCounter-1]] = _indexToSwap;
        }

        delete deployedCampaigns[campaignCounter - 1];
        delete campaignToId[msg.sender];
        campaignCounter--;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function deployProposalContract(address _manager) external override {
        require(campaignToId[msg.sender] != 0, "!Not Authorized");
        IProposal _proposalContract = new Proposal(msg.sender, _manager);
        ICampaign(msg.sender).setProposal(address(_proposalContract));
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function updateOwner(address _newOwner) external override onlyOwner() {
        owner = _newOwner;
    }

    /**
     * @inheritdoc ICampaignFactory
     */
    function setCampaignCreator(address _campaignCreatorContract) external override onlyOwner() {
        campaignCreatorContract = _campaignCreatorContract;
    }
}
