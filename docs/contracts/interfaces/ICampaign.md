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



### updateCampaign
Update the campaign information in the struct Info.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateCampaign(
    struct ICampaign.Info updatedInfoData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`updatedInfoData` | struct ICampaign.Info | Info Object that contains all the new information following the Info struct for the campaign

### addReward
Add a new reward level to the campaign.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function addReward(
    struct ICampaign.Rewards newRewardData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newRewardData` | struct ICampaign.Rewards | Rewards Object that contains all the needed information following the Rewards struct for the campaign

### updateReward
Update the data of a specific reward regarding its id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateReward(
    struct ICampaign.Rewards newRewardData,
    uint8 rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newRewardData` | struct ICampaign.Rewards | Rewards Object that contains the new data to set following the Rewards struct for the campaign
|`rewardIndex` | uint8 | uint256 Index of the reward to update

### deleteReward
Delete a reward by its Id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function deleteReward(
    uint8 rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rewardIndex` | uint8 | uint256 Index of the reward to delete

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
    address newManager
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newManager` | address | address Address of the new manager

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
  ) external
```

#### Modifiers:
No modifiers



### refund
Allow contributor to get refunded.

> Can only be called if campiagn deadline is passed and fundingGoal not reached.

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
Allows campiagn factory contract to set proposal contract address.

> Can only be called by campaign factory contract.

#### Declaration
```solidity
  function setProposal(
  ) external
```

#### Modifiers:
No modifiers



### releaseProposalFunds
Transfer unlocked funds to manager address.

> Can only be called by proposal contract when proposal is accepted.

#### Declaration
```solidity
  function releaseProposalFunds(
  ) external
```

#### Modifiers:
No modifiers





