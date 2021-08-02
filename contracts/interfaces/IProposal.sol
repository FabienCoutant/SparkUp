// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.6;

/**
* @title IProposal
* @notice The Proposal contract handles all proposals submitted by campaign manager and votes by contributors
* @dev Interface for the Proposal contract
*/
interface IProposal {

    struct Proposal {
        uint256 id;
        string title;
        string description;
        bool accepted;
        uint64 deadline;
        uint128 amount;
        uint128 okVotes;
        uint128 nokVotes;
        ProposalType proposalType;
        WorkflowStatus status;
    }

    enum ProposalType{
        Active,
        Archived,
        Deleted
    }

    enum WorkflowStatus {
        Pending,
        Registered,
        VotingSessionStarted,
        VotesTallied
    }

    /**
     * @notice Create a new proposal
     * @param _title as proposal title, _description as proposal description and _amount as amount to be unlocked for spending
     * @dev can only be called by campaign manager and if WorkflowStatus is Pending
     */
    function createProposal(string memory _title, string memory _description, uint128 _amount) external;

    /**
     * @notice Delete proposal
     * @param proposalId as proposal index in proposalList array
     * @dev can only be called by campaign manager and if WorkflowStatus is Registered
     */
    function deleteProposal(uint8 proposalId) external;

    /**
     * @notice start proposal voting process
     * @param proposalId as proposal index in proposalList array
     * @dev can only be called by campaign manager and if WorkflowStatus is Registered
     */
    function startVotingSession(uint8 proposalId) external;

    /**
     * @notice enable contributors to vote for or against proposal
     * @param proposalId as proposal index in proposalList array and _vote as 1 for ok and 0 for nok
     * @dev can only be called by contributors and if WorkflowStatus is VotingSessionStarted
     */
    function voteProposal(uint8 proposalId, bool vote) external;

    /**
     * @notice check if proposal is ok or nok
     * @param proposalId as proposal index in proposalList array
     * @dev can only be called only if proposal deadline is passed
     */
    function getResults(uint8 proposalId) external;



    function getProposals(ProposalType _proposalStatus) external view returns(Proposal[] memory);

}
