// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import './interfaces/IProposal.sol';
import './Campaign.sol';

contract Proposal is IProposal {

    uint128 public availableFunds;
    uint256 public proposalCounter;
    address public immutable campaignAddress;
    address public campaignManager;

    Campaign campaignContract;

    mapping(uint => Proposal) public proposalsList;
    mapping(uint => mapping(address => bool)) public hasVoted;

    constructor(address _campaignAddress, address _manager) {
        campaignAddress = _campaignAddress;
        campaignContract = Campaign(_campaignAddress);
        campaignManager = _manager;
        availableFunds = uint128(_getCampaignUSDCBalance());
    }

    modifier isContributor() {
        require(campaignContract.contributorBalances(msg.sender) > 0, "!Err: not a contributor");
        _;
    }

    modifier checkStatus(
        uint256 proposalId,
        WorkflowStatus requiredStatus
    ) {
        require(proposalsList[proposalId].status == requiredStatus, "!Err : Wrong workflow status");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == campaignManager, "!Err: not manager");
        _;
    }

    modifier checkProposalDeadline(uint256 proposalId) {
        require(block.timestamp < proposalsList[proposalId].deadline, "!Err: proposal voting has ended");
        _;
    }

    /**
     * @inheritdoc IProposal
     */
    function createProposal(string memory _title, string memory _description, uint128 _amount) external override onlyManager() checkStatus(proposalCounter, WorkflowStatus.Pending) {
        require(proposalCounter < 5, "!Err: Maximum amount of proposal reached");
        require(bytes(_title).length > 0, "!Err: Title empty");
        require(bytes(_description).length > 0, "!Err: Description empty");
        require(_amount >= 100 ether, "!Err: Amount too low");
        require(_amount <= availableFunds, "!Err: Proposal amount exceeds campaign USDC balance");
        Proposal memory p;
        p.title = _title;
        p.description = _description;
        p.amount = _amount;
        p.status = WorkflowStatus.Registered;
        proposalsList[proposalCounter] = p;
        proposalCounter++;
        availableFunds = availableFunds - _amount;
    }

    /**
     * @inheritdoc IProposal
     */
    function deleteProposal(uint8 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered) {
        availableFunds = availableFunds + proposalsList[proposalId].amount;
        proposalsList[proposalId].proposalStatus = ProposalStatus.Deleted;
    }

    /**
     * @inheritdoc IProposal
     */
    function startVotingSession(uint8 proposalId) external override onlyManager() checkStatus(proposalId, WorkflowStatus.Registered) {
        proposalsList[proposalId].status = WorkflowStatus.VotingSessionStarted;
        proposalsList[proposalId].deadline = uint64(block.timestamp + 7 days);
    }

    /**
     * @inheritdoc IProposal
     */
    function voteProposal(uint8 proposalId, bool vote) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) checkProposalDeadline(proposalId) isContributor() {
        require(!hasVoted[proposalId][msg.sender], "!Err: Already voted");
        uint128 contributorVotes = campaignContract.contributorBalances(msg.sender);
        if (vote) {
            proposalsList[proposalId].okVotes = proposalsList[proposalId].okVotes + contributorVotes;
        } else {
            proposalsList[proposalId].nokVotes = proposalsList[proposalId].nokVotes + contributorVotes;
        }
        hasVoted[proposalId][msg.sender] = true;
    }

    /**
     * @inheritdoc IProposal
     */
    function getResults(uint8 proposalId) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) {
        require(block.timestamp > proposalsList[proposalId].deadline, "!Err: Voting still ongoing");
        proposalsList[proposalId].status = WorkflowStatus.VotesTallied;
        if (proposalsList[proposalId].okVotes > proposalsList[proposalId].nokVotes) {
            campaignContract.releaseProposalFunds(proposalsList[proposalId].amount);
            proposalsList[proposalId].accepted = true;
        }
        proposalsList[proposalId].proposalStatus=ProposalStatus.Archived;
    }

    /**
     * @notice Return the amount in USDC raised by the campaign
     * @dev amount uint USDC raised by the campaign in WEI
     */
    function _getCampaignUSDCBalance() internal view returns (uint256) {
        return campaignContract.getContractUSDCBalance();
    }


    function getProposals(ProposalStatus _proposalStatus) external view override returns(Proposal[] memory){
        Proposal[] memory listOfProposals;
        uint256 j;
        for(uint256 i=0;i<proposalCounter;i++){
            if(proposalsList[i].proposalStatus==_proposalStatus){
                listOfProposals[j]=proposalsList[i];
                j++;
            }
        }
        return listOfProposals;
    }
} 
