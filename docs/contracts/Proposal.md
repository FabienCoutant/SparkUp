# Proposal





## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Modifiers](#modifiers)
  - [isContributor](#iscontributor)
  - [checkStatus](#checkstatus)
  - [onlyManager](#onlymanager)
  - [checkProposalDeadline](#checkproposaldeadline)
- [Functions](#functions)
  - [constructor](#constructor)
  - [createProposal](#createproposal)
  - [deleteProposal](#deleteproposal)
  - [startVotingSession](#startvotingsession)
  - [voteProposal](#voteproposal)
  - [getResults](#getresults)
  - [_getCampaignUSDCBalance](#_getcampaignusdcbalance)
  - [getProposals](#getproposals)
- [Events](#events)
  - [proposalCreated](#proposalcreated)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| availableFunds | uint128 |
| proposalCounter | uint256 |
| proposalTypeCounter | mapping(enum IProposal.ProposalType => uint256) |
| campaignAddress | address |
| campaignManager | address |
| campaignContract | contract Campaign |
| proposalsList | mapping(uint256 => struct IProposal.Proposal) |
| hasVoted | mapping(uint256 => mapping(address => bool)) |


## Modifiers

### isContributor
No description


#### Declaration
```solidity
  modifier isContributor
```


### checkStatus
No description


#### Declaration
```solidity
  modifier checkStatus
```


### onlyManager
No description


#### Declaration
```solidity
  modifier onlyManager
```


### checkProposalDeadline
No description


#### Declaration
```solidity
  modifier checkProposalDeadline
```



## Functions

### constructor
No description


#### Declaration
```solidity
  function constructor(
  ) public
```

#### Modifiers:
No modifiers



### createProposal
Create a new proposal

> can only be called by campaign manager and if WorkflowStatus is Pending

#### Declaration
```solidity
  function createProposal(
    string _title
  ) external onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_title` | string | as proposal title, _description as proposal description and _amount as amount to be unlocked for spending


### deleteProposal
Delete proposal

> can only be called by campaign manager and if WorkflowStatus is Registered

#### Declaration
```solidity
  function deleteProposal(
    uint8 proposalId
  ) external onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`proposalId` | uint8 | as proposal index in proposalList array


### startVotingSession
start proposal voting process

> can only be called by campaign manager and if WorkflowStatus is Registered

#### Declaration
```solidity
  function startVotingSession(
    uint8 proposalId
  ) external onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`proposalId` | uint8 | as proposal index in proposalList array


### voteProposal
enable contributors to vote for or against proposal

> can only be called by contributors and if WorkflowStatus is VotingSessionStarted

#### Declaration
```solidity
  function voteProposal(
    uint8 proposalId
  ) external checkStatus checkProposalDeadline isContributor
```

#### Modifiers:
| Modifier |
| --- |
| checkStatus |
| checkProposalDeadline |
| isContributor |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`proposalId` | uint8 | as proposal index in proposalList array and _vote as 1 for ok and 0 for nok


### getResults
check if proposal is ok or nok

> can only be called only if proposal deadline is passed

#### Declaration
```solidity
  function getResults(
    uint8 proposalId
  ) external checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`proposalId` | uint8 | as proposal index in proposalList array


### _getCampaignUSDCBalance
Return the amount in USDC raised by the campaign

> amount uint USDC raised by the campaign in WEI

#### Declaration
```solidity
  function _getCampaignUSDCBalance(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers



### getProposals
return list of proposal matching proposalType of param



#### Declaration
```solidity
  function getProposals(
    enum IProposal.ProposalType _proposalStatus
  ) external returns (struct IProposal.Proposal[])
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalStatus` | enum IProposal.ProposalType | is proposalType (active, archived or deleted)



## Events

### proposalCreated
No description




