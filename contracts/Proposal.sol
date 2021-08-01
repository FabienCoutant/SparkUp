// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import './interfaces/IProposal.sol';
import './Campaign.sol';
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Proposal is IProposal {
    using SafeMath for uint256;
    
    address public immutable campaignAddress;
    address public campaignManager;
    uint16 public proposalCounter;
    uint256 public availableFunds;
    Campaign campaignContract;
    
    mapping(uint => Proposal) public proposals;
    mapping(address => bool) public hasVoted;
    
    constructor(address _campaignAddress, address _manager) {
        campaignAddress = _campaignAddress;
        campaignContract = Campaign(_campaignAddress);
        campaignManager = _manager;
        availableFunds = _getCampaignUSDCBalance();
    }
    
    modifier isContributor() {
        require(campaignContract.contributorBalances(msg.sender) > 0, "!Err: not a contributor");
        _;
    }
    
    modifier checkStatus(
        uint proposaId,
        WorkflowStatus requiredStatus
    ) {
        require(proposals[proposaId].status == requiredStatus, "!Err : Wrong workflow status");
        _;
    }
    
    modifier onlyManager() {
        require(msg.sender == campaignManager, "!Err: not manager");
        _;
    }
    
    modifier checkProposalDeadline(uint256 proposalId) {
        require(block.timestamp < proposals[proposalId].deadline, "!Err: proposal voting has ended");
        _;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function createProposal(string memory _title, string memory _description, uint _amount ) external override onlyManager() checkStatus(proposalCounter, WorkflowStatus.Pending) {
        require(proposalCounter < 5, "!Err: Maximum amount of proposal reached");
        require(bytes(_title).length > 0, "!Err: Title empty");
        require(bytes(_description).length > 0, "!Err: Description empty");
        require(_amount > 100 ether, "!Err: Amount too low");
        require(_amount <= availableFunds, "!Err: Proposal amount exceeds campaign USDC balance");
        Proposal memory p;
        p.id = proposalCounter;
        p.title = _title;
        p.description = _description;
        p.amount = _amount;
        p.status = WorkflowStatus.Registered;
        proposals[proposalCounter] = p;
        proposalCounter++;
        availableFunds = availableFunds.sub(_amount);
    }
    
    /**
     * @inheritdoc IProposal
     */
    function deleteProposal(uint256 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered) {
        availableFunds = availableFunds.add(proposals[proposalId].amount);
        if (proposalId == proposalCounter - 1) {
            delete  proposals[proposalId];
        } else {
            proposals[proposalId] = proposals[proposalCounter - 1];
            delete proposals[proposalCounter -1];
        }
        proposalCounter--;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function startVotingSession(uint256 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered){
        proposals[proposalId].status = WorkflowStatus.VotingSessionStarted;
        proposals[proposalId].deadline = block.timestamp + 7 days;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function voteProposal(uint256 proposalId, bool vote) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) checkProposalDeadline(proposalId) isContributor() {
        require(!hasVoted[msg.sender], "!Err: Already voted");
        uint contributorVotes = campaignContract.contributorBalances(msg.sender);
        if (vote) {
            proposals[proposalId].okVotes = proposals[proposalId].okVotes.add(contributorVotes);
        } else {
            proposals[proposalId].nokVotes = proposals[proposalId].nokVotes.add(contributorVotes);  
        }
        hasVoted[msg.sender] = true;
    }
    
    /**
     * @inheritdoc IProposal
     */
    function getResults(uint256 proposalId) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted){
        require(block.timestamp > proposals[proposalId].deadline, "!Err: Voting still ongoing");
        proposals[proposalId].status = WorkflowStatus.VotesTallied;
        if (proposals[proposalId].okVotes > proposals[proposalId].nokVotes) {
            proposals[proposalId].accepted = true;
            campaignContract.realeaseProposalFunds(proposals[proposalId].amount);
        } else {
            proposals[proposalId].accepted = false;
        }
    }
    
    function _getCampaignUSDCBalance() internal view returns (uint256) {
        return campaignContract.getContractUSDCBalance();
    }
} 