# Design Pattern Decisions

This document explains which solidity design pattern
([following the reference link](https://fravoll.github.io/solidity-patterns/)) we are using and how.

- Behavioral Patterns
  - [x] **Guard Check**: Ensure that the behavior of a smart contract and its input parameters are as expected.
  - [x] **State Machine**: Enable a contract to go through different stages with different corresponding functionality exposed.
  - [ ] Oracle: Gain access to data stored outside of the blockchain.
  - [ ] Randomness: Generate a random number of a predefined interval in the deterministic environment of a blockchain.
- Security Patterns
  - [x] **Access Restriction**: Restrict the access to contract functionality according to suitable criteria.
  - [ ] Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.
  - [ ] Secure Ether Transfer: Secure transfer of ether from a contract to another address.
  - [x] **Pull over Push**: Shift the risk associated with transferring ether to the user.
  - [ ] Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.
- Upgradeability Patterns
  - [ ] Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
  - [ ] Eternal Storage: Keep contract storage after a smart contract upgrade.
- Economic Patterns
  - [ ] String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.
  - [x] **Tight Variable Packing**: Optimize gas consumption when storing or loading statically-sized variables.
  - [ ] Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

## Behavioral Patterns

### **_Guard Check_**

To ensure that the behavior of our smart contracts and their input parameters are as expected, we use several require() and **modifiers**. For example :

```
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

modifier checkStatus(
        WorkflowStatus currentStatus,
        WorkflowStatus requiredStatus
    ) {
        require(currentStatus == requiredStatus, "!Err : Wrong workflow status");
        _;
    }
```

### **_State Machine_**

To enable our contracts to go through different stages with different corresponding functionality exposed, we use several workflow systems. For example :

```
WorkflowStatus public status;

enum WorkflowStatus {
        CampaignDrafted,
        CampaignPublished,
        FundingComplete,
        FundingFailed,
        CampaignCompleted,
        CampaignDeleted
    }
```

## Security Patterns

### **_Access Restriction_**

To restrict the access to contract functionality according to suitable criteria, we used several modifers and require(). For example:

```
modifier onlyManager() {
        require(msg.sender == campaignManager, "!Err: not manager");
        _;
    }

function voteProposal(uint8 proposalId, bool vote) external override checkStatus(proposalId, WorkflowStatus.VotingSessionStarted) checkProposalDeadline(proposalId) isContributor() {
    require(!hasVoted[msg.sender], "!Err: Already voted");
    uint128 contributorVotes = campaignContract.contributorBalances(msg.sender);
    if (vote) {
        proposals[proposalId].okVotes = proposals[proposalId].okVotes + contributorVotes;
    } else {
        proposals[proposalId].nokVotes = proposals[proposalId].nokVotes + contributorVotes;
    }
    hasVoted[msg.sender] = true;
}
```

### **_Pull over Push_**

To shift the risk associated with transferring USDC to the user we use a pull over push system. For example in order to get refunded in the case of a failed campaign we use :

```
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
```

## Upgradeability Patterns

### **_Tight Variable Packing_**

To optimize gas consumption when storing or loading statically-sized variables, our variables order in our structs is build to pack various variables sizes. For example:

```
struct Rewards {
        string title;
        string description;
        bool isStockLimited;
        uint16 stockLimit;
        uint64 nbContributors;
        uint128 minimumContribution;
        uint128 amount;
    }
```
