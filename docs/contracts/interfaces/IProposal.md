# IProposal


The Proposal contract handles all proposals submitted by campaign manager and votes by contributors

> Interface for the Proposal contract

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [createProposal](#createproposal)
  - [deleteProposal](#deleteproposal)
  - [startVotingSession](#startvotingsession)
  - [voteProposal](#voteproposal)
  - [getResults](#getresults)
  - [getProposals](#getproposals)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Functions

### createProposal
Create a new proposal

> can only be called by campaign manager and if WorkflowStatus is Pending

#### Declaration
```solidity
  function createProposal(
    string _title,
    string _description,
    uint128 _amount
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_title` | string | The proposal title
|`_description` | string | The proposal description
|`_amount` | uint128 | The amount to be unlocked for spending


### deleteProposal
Delete proposal

> can only be called by campaign manager and if WorkflowStatus is Registered

#### Declaration
```solidity
  function deleteProposal(
    uint8 _proposalId
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalId` | uint8 | The proposal's index inside the proposalList array


### startVotingSession
start proposal voting process

> can only be called by campaign manager and if WorkflowStatus is Registered

#### Declaration
```solidity
  function startVotingSession(
    uint8 _proposalId
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalId` | uint8 | The proposal's index inside the proposalList array


### voteProposal
enable contributors to vote for or against proposal

> can only be called by contributors and if WorkflowStatus is VotingSessionStarted

#### Declaration
```solidity
  function voteProposal(
    uint8 _proposalId,
    bool _vote
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalId` | uint8 | The proposal's index inside the proposalList array
|`_vote` | bool | As 1 for ok and 0 for nok


### getResults
check if proposal is ok or nok

> can only be called only if proposal deadline is passed

#### Declaration
```solidity
  function getResults(
    uint8 _proposalId
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalId` | uint8 | The proposal's index inside the proposalList array


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
|`_proposalStatus` | enum IProposal.ProposalType | The proposalType (active, archived or deleted)

#### Returns:
| Type | Description |
| --- | --- |
|`Array` | The list of Proposals corresponding to the _proposalStatus


