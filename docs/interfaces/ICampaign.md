# ICampaign


The Campaign contract handle the all life of one Campaign. It's generate by the CampaignFactory.

> Interface for the Campaign contract

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [updateAllInfoData](#updateallinfodata)
  - [addReward](#addreward)
  - [updateAllRewardsData](#updateallrewardsdata)
  - [updateRewardData](#updaterewarddata)
  - [deleteReward](#deletereward)
  - [deleteCampaign](#deletecampaign)
  - [updateManager](#updatemanager)
  - [updateFactory](#updatefactory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Functions

### updateAllInfoData
Update all the information in the struct Info for the campaign.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateAllInfoData(
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

### updateAllRewardsData
Update all Rewards by removing each current reward and then adding the new levels.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateAllRewardsData(
    struct ICampaign.Rewards[] updatedRewardsData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`updatedRewardsData` | struct ICampaign.Rewards[] | Rewards[] Array of Object that contains all the needed information following the Rewards struct for the campaign

### updateRewardData
Update the data of a specific reward regarding its id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateRewardData(
    struct ICampaign.Rewards newRewardData,
    uint256 rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newRewardData` | struct ICampaign.Rewards | Rewards Object that contains the new data to set following the Rewards struct for the campaign
|`rewardIndex` | uint256 | uint256 Index of the reward to update

### deleteReward
Delete a reward by its Id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function deleteReward(
    uint256 rewardIndex
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rewardIndex` | uint256 | uint256 Index of the reward to delete

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

### updateFactory
Allow the factory to setup a new one in case of migration.

> Used for mainly for pointing the right factory during the deletion


#### Declaration
```solidity
  function updateFactory(
    address newFactory
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newFactory` | address | address Address of the new factory



