# Campaign





## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Modifiers](#modifiers)
  - [isNotDisabled](#isnotdisabled)
  - [onlyManager](#onlymanager)
- [Functions](#functions)
  - [constructor](#constructor)
  - [updateAllInfoData](#updateallinfodata)
  - [addReward](#addreward)
  - [updateAllRewardsData](#updateallrewardsdata)
  - [updateRewardData](#updaterewarddata)
  - [deleteCampaign](#deletecampaign)
  - [deleteReward](#deletereward)
  - [updateManager](#updatemanager)
  - [updateFactory](#updatefactory)
- [Events](#events)
  - [newCampaign](#newcampaign)
  - [CampaignNewRewardsAdded](#campaignnewrewardsadded)
  - [CampaignInfoUpdated](#campaigninfoupdated)
  - [CampaignRewardsUpdated](#campaignrewardsupdated)
  - [CampaignDisabled](#campaigndisabled)
  - [CampaignRewardDeleted](#campaignrewarddeleted)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| createAt | uint256 |
| lastUpdatedAt | uint256 |
| manager | address |
| factory | address |
| isDisabled | bool |
| campaignInfo | struct ICampaign.Info |
| rewardsList | mapping(uint256 => struct ICampaign.Rewards) |
| rewardsCounter | uint256 |


## Modifiers

### isNotDisabled
No description


#### Declaration
```solidity
  modifier isNotDisabled
```


### onlyManager
No description


#### Declaration
```solidity
  modifier onlyManager
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



### updateAllInfoData
Update all the information in the struct Info for the campaign.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateAllInfoData(
    struct ICampaign.Info updatedInfoData
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |

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
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |

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
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |

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
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newRewardData` | struct ICampaign.Rewards | Rewards Object that contains the new data to set following the Rewards struct for the campaign
|`rewardIndex` | uint256 | uint256 Index of the reward to update

### deleteCampaign
Delete the campaign.

> It's the entry point for deleting a campaign. Only the manager must be able to call it

#### Declaration
```solidity
  function deleteCampaign(
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |



### deleteReward
Delete a reward by its Id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function deleteReward(
    uint256 rewardIndex
  ) external isNotDisabled onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDisabled |
| onlyManager |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rewardIndex` | uint256 | uint256 Index of the reward to delete

### updateManager
Allow the manager to setup a new one.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateManager(
    address newManager
  ) external onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |

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



## Events

### newCampaign
No description




### CampaignNewRewardsAdded
No description




### CampaignInfoUpdated
No description




### CampaignRewardsUpdated
No description




### CampaignDisabled
No description




### CampaignRewardDeleted
No description




