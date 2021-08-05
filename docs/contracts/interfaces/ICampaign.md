# ICampaign


The Campaign contract handle the all life of one Campaign. It's generate by the CampaignFactory.

> Interface for the Campaign contract

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [getCampaignInfo](#getcampaigninfo)
  - [updateCampaign](#updatecampaign)
  - [addReward](#addreward)
  - [updateReward](#updatereward)
  - [deleteReward](#deletereward)
  - [deleteCampaign](#deletecampaign)
  - [updateManager](#updatemanager)
  - [publishCampaign](#publishcampaign)
  - [contribute](#contribute)
  - [refund](#refund)
  - [launchProposalContract](#launchproposalcontract)
  - [setProposal](#setproposal)
  - [releaseProposalFunds](#releaseproposalfunds)
  - [getContributorBalances](#getcontributorbalances)
  - [getContractUSDCBalance](#getcontractusdcbalance)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Functions

### getCampaignInfo
Returns the campaign information in the struct Info plus de createAt and the managerAddress.



#### Declaration
```solidity
  function getCampaignInfo(
  ) external returns (struct ICampaign.Info, uint64, address, enum ICampaign.WorkflowStatus, uint128, address)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`Info` | The campaign Info data set
|`createAt` | The campaign creation date in timestamps
|`manager` | The address of the campaign manager
|`WorkflowStatus` | The workflow status of the campaign
|`totalRaised` | The amount raised by the campaign in USDC
|`proposalAddress` | The address of the proposal contract link to the campaign
### updateCampaign
Update the campaign information in the struct Info.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateCampaign(
    struct ICampaign.Info _updatedInfoData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_updatedInfoData` | struct ICampaign.Info | is The Info Object that contains all the new information following the Info struct for the campaign

### addReward
Add a new reward level to the campaign.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function addReward(
    struct ICampaign.Rewards _newRewardData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_newRewardData` | struct ICampaign.Rewards | The Rewards Object that contains all the needed information which follow the Rewards struct for the campaign

### updateReward
Update the data of a specific reward regarding its id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateReward(
    struct ICampaign.Rewards _newRewardData,
    uint8 _rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_newRewardData` | struct ICampaign.Rewards | The rewards Object that contains the new data to set which follow the Rewards struct for the campaign
|`_rewardIndex` | uint8 | The reward's index to update

### deleteReward
Delete a reward by its Id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function deleteReward(
    uint8 _rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_rewardIndex` | uint8 | The reward's index to delete

### deleteCampaign
Delete the campaign.

> It's the entry point for deleting a campaign. Only the manager must be able to call it

#### Declaration
```solidity
  function deleteCampaign(
  ) external
```

#### Modifiers:
No modifiers



### updateManager
Allow the manager to setup a new one.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateManager(
    address _newManager
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_newManager` | address | The new manager's address

### publishCampaign
Allow the manager to publish campaign and make it visible to potential contributors.

> Only the manager must be able to call it and only within acceptable deadlineDate timeframe.

#### Declaration
```solidity
  function publishCampaign(
  ) external
```

#### Modifiers:
No modifiers



### contribute
Allow contributors to contribute to the campaign.

> Can only be called if campaign is published, is not completed, is not deleted and is not failed.


#### Declaration
```solidity
  function contribute(
    uint128 _amount,
    uint8 _rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_amount` | uint128 | The Amount in USDC that msg.sender want to contribute
|`_rewardIndex` | uint8 | The reward's index

### refund
Allow contributor to get refunded.

> Can only be called if campaign deadline is passed and fundingGoal not reached.

#### Declaration
```solidity
  function refund(
  ) external
```

#### Modifiers:
No modifiers



### launchProposalContract
Allows manager to deploy proposal contract to start submitting proposals.

> Can only be called by manager and if WorkflowStatus is FundingComplete.

#### Declaration
```solidity
  function launchProposalContract(
  ) external
```

#### Modifiers:
No modifiers



### setProposal
Allows campaign factory contract to set proposal contract address.

> Can only be called by campaign factory contract.


#### Declaration
```solidity
  function setProposal(
    address _proposalContract
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proposalContract` | address | The proposal contract's address

### releaseProposalFunds
Transfer unlocked funds to manager address.

> Can only be called by proposal contract when proposal is accepted.


#### Declaration
```solidity
  function releaseProposalFunds(
    uint128 _amount
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_amount` | uint128 | The Amount of funding raised that must be transfer to the manager

### getContributorBalances
Return the contribution balance in usdc for a specific address



#### Declaration
```solidity
  function getContributorBalances(
    address _account
  ) external returns (uint128)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_account` | address | The contributor's address

#### Returns:
| Type | Description |
| --- | --- |
|`Amount` | The Amount contributed by the _account
### getContractUSDCBalance
Make _campaignUSDCBalance available to external and used by Interface

> Note that USDC using 6 decimals instead of 18


#### Declaration
```solidity
  function getContractUSDCBalance(
  ) external returns (uint128)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`balance` | The current balance of the current contract


