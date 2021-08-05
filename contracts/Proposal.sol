// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

import './interfaces/IProposal.sol';
import './interfaces/ICampaign.sol';

contract Proposal is IProposal {

    uint128 public availableFunds;
    uint256 public proposalCounter;
    mapping(ProposalType => uint256) public proposalTypeCounter;
    address public immutable campaignAddress;
    address public campaignManager;

    ICampaign campaignContract;

    mapping(uint => Proposal) public proposalsList;
    mapping(uint => mapping(address => bool)) public hasVoted;

    event proposalCreated(uint256 proposalId);

    constructor(address _campaignAddress, address _manager) {
        campaignAddress = _campaignAddress;
        campaignContract = ICampaign(_campaignAddress);
        campaignManager = _manager;
        availableFunds = ICampaign(_campaignAddress).getContractUSDCBalance();
    }

    modifier isContributor() {
        require(campaignContract.getContributorBalances(msg.sender) > 0, "!Err: not a contributor");
        _;
    }

    modifier checkStatus(
        uint256 _proposalId,
        WorkflowStatus _requiredStatus
    ) {
        require(proposalsList[_proposalId].status == _requiredStatus, "!Err : Wrong workflow status");
        _;
    }

    modifier onlyManager() {
        require(msg.sender == campaignManager, "!Err: not manager");
        _;
    }

    modifier checkProposalDeadline(uint256 _proposalId) {
        require(block.timestamp < proposalsList[_proposalId].deadline, "!Err: proposal voting has ended");
        _;
    }

    /**
     * @inheritdoc IProposal
     */
    function createProposal(string memory _title, string memory _description, uint128 _amount) external override onlyManager() checkStatus(proposalCounter, WorkflowStatus.Pending) {
        require(proposalCounter < 5, "!Err: Maximum amount of proposal reached");
        require(bytes(_title).length > 0, "!Err: Title empty");
        require(bytes(_description).length > 0, "!Err: Description empty");
        require(_amount > 0, "!Err: Amount too low");
        require(_amount <= availableFunds, "!Err: Proposal amount exceeds campaign USDC balance");
        Proposal memory p;
        p.id = proposalCounter;
        p.title = _title;
        p.description = _description;
        p.amount = _amount;
        p.status = WorkflowStatus.Registered;
        proposalsList[proposalCounter] = p;
        proposalTypeCounter[ProposalType.Active]++;
        emit proposalCreated(proposalCounter);
        proposalCounter++;
        availableFunds = availableFunds - _amount;
    }

    /**
     * @inheritdoc IProposal
     */
    function deleteProposal(uint8 _proposalId) external override onlyManager() checkStatus(_proposalId, WorkflowStatus.Registered) {
        availableFunds = availableFunds + proposalsList[_proposalId].amount;
        proposalsList[_proposalId].proposalType = ProposalType.Deleted;
        proposalTypeCounter[ProposalType.Deleted]++;
        proposalTypeCounter[ProposalType.Active]--;
    }

    /**
     * @inheritdoc IProposal
     */
    function startVotingSession(uint8 _proposalId) external override onlyManager() checkStatus(_proposalId, WorkflowStatus.Registered) {
        proposalsList[_proposalId].status = WorkflowStatus.VotingSessionStarted;
        proposalsList[_proposalId].deadline = uint64(block.timestamp + 7 days);
    }

    /**
     * @inheritdoc IProposal
     */
    function voteProposal(uint8 _proposalId, bool _vote) external override checkStatus(_proposalId, WorkflowStatus.VotingSessionStarted) checkProposalDeadline(_proposalId) isContributor() {
        require(!hasVoted[_proposalId][msg.sender], "!Err: Already voted");
        uint128 contributorVotes = campaignContract.getContributorBalances(msg.sender);
        if (_vote) {
            proposalsList[_proposalId].okVotes = proposalsList[_proposalId].okVotes + contributorVotes;
        } else {
            proposalsList[_proposalId].nokVotes = proposalsList[_proposalId].nokVotes + contributorVotes;
        }
        hasVoted[_proposalId][msg.sender] = true;
    }

    /**
     * @inheritdoc IProposal
     */
    function getResults(uint8 _proposalId) external override checkStatus(_proposalId, WorkflowStatus.VotingSessionStarted) {
        require(block.timestamp > proposalsList[_proposalId].deadline, "!Err: Voting still ongoing");
        proposalsList[_proposalId].status = WorkflowStatus.VotesTallied;
        if (proposalsList[_proposalId].okVotes > proposalsList[_proposalId].nokVotes) {
            campaignContract.releaseProposalFunds(proposalsList[_proposalId].amount);
            proposalsList[_proposalId].accepted = true;
        }else{
            availableFunds = availableFunds + proposalsList[_proposalId].amount;
        }
        proposalsList[_proposalId].proposalType=ProposalType.Archived;
        proposalTypeCounter[ProposalType.Archived]++;
        proposalTypeCounter[ProposalType.Active]--;
    }

    /**
     * @inheritdoc IProposal
     */
    function getProposals(ProposalType _proposalType) external view override returns(Proposal[] memory){
        Proposal[] memory listOfProposals = new Proposal[](proposalTypeCounter[_proposalType]);
        uint256 j;
        for(uint256 i=0;i<proposalCounter;i++){
            if(proposalsList[i].proposalType==_proposalType){
                listOfProposals[j]=proposalsList[i];
                j++;
            }
        }
        return listOfProposals;
    } 
} 
