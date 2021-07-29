// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import './interfaces/IProposal.sol';
import './Campaign.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Proposal is IProposal {
    using SafeMath for uint256;
    
    
    address public immutable campaignAddress;
    address public campaignManager;
    uint proposalCounter;
    Campaign campaignContract;
    
    Proposal[] public proposalList;
    mapping(address => bool) hasVoted;
    
    constructor(address _campaignAddress) {
        campaignAddress = _campaignAddress;
        campaignContract = Campaign(_campaignAddress);
        campaignManager = Campaign(_campaignAddress).manager();
    }
    
    modifier isContributor() {
        require(campaignContract.contributorBalances(msg.sender) > 0, "!Err: not a contributor");
        _;
    }
    
    modifier checkStatus(
        uint proposaId,
        WorkflowStatus requiredStatus
    ) {
        require(proposalList[proposaId].status == requiredStatus, "!Err : Wrong workflow status");
        _;
    }
    
    modifier onlyManager() {
        require(msg.sender == campaignManager, "!Err: not manager");
        _;
    }
    
    modifier checkProposalDeadline(uint256 proposalId) {
        require(block.timestamp < proposalList[proposalId].deadline, "!Err: propsal voting has ended");
        _;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function createProposal(string memory _title, string memory _description, uint _amount ) external override onlyManager() checkStatus(proposalCounter, WorkflowStatus.Pending){
        require(proposalList.length < 6, "!Err: Maximum amount of proposal reached");
        require(bytes(_title).length > 0, "!Err: Title empty");
        require(bytes(_description).length > 0, "!Err: Description empty");
        require(_amount <= _getCampaignUSDCBalance(), "!Err: Proposal amount exceeds campaign USDC balance");
        proposalList[proposalCounter].id = proposalCounter;
        proposalList[proposalCounter].title = _title;
        proposalList[proposalCounter].description = _description;
        proposalList[proposalCounter].amount = _amount;
        proposalList[proposalCounter].status = WorkflowStatus.Registered;
        proposalCounter++;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function deleteProposal(uint256 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered) {
        if (proposalId == proposalCounter - 1) {
            delete  proposalList[proposalId];
        } else {
            proposalList[proposalId] = proposalList[proposalCounter - 1];
            delete proposalList[proposalCounter -1];
        }
    }
    
    /**
     * @inheritdoc IProposal
     */
    function startVotingSession(uint256 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered){
        proposalList[proposalId].status = WorkflowStatus.VotingSessionStarted;
        proposalList[proposalId].deadline = block.timestamp + 5 days;
    }
    
    function voteProposal(uint256 proposalId, uint8 _vote) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) checkProposalDeadline(proposalId) {
        require(!hasVoted[msg.sender], "!Err: Already voted");
        uint contributorVotes = campaignContract.contributorBalances(msg.sender);
        if (_vote == 1) {
            proposalList[proposalId].okvotes = proposalList[proposalId].okvotes.add(contributorVotes);
        } else if (_vote == 0) {
            proposalList[proposalId].nokvotes = proposalList[proposalId].okvotes.add(contributorVotes);  
        }
        hasVoted[msg.sender] = true;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function getResults(uint256 proposalId) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) returns(uint8){
        require(block.timestamp > proposalList[proposalId].deadline, "!Err: voting still ongoing");
        proposalList[proposalId].status = WorkflowStatus.VotesTallied;
        if (proposalList[proposalId].okvotes > proposalList[proposalId].nokvotes) {
            return 1;
        } else {
            return 0;
        }
    }
    
    function _getCampaignUSDCBalance() internal view returns (uint256) {
        return campaignContract.getContractUSDCBalance();
    }
    
    function _getAllowance() internal view returns (uint256) {
        return Campaign(campaignAddress).usdcToken().allowance(msg.sender, campaignAddress);
    }
}