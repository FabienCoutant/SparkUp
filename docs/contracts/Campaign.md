# Campaign





## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Modifiers](#modifiers)
  - [isNotDeleted](#isnotdeleted)
  - [onlyManager](#onlymanager)
  - [checkStatus](#checkstatus)
  - [checkCampaignDeadline](#checkcampaigndeadline)
- [Functions](#functions)
  - [constructor](#constructor)
  - [getCampaignInfo](#getcampaigninfo)
  - [updateCampaign](#updatecampaign)
  - [addReward](#addreward)
  - [updateReward](#updatereward)
  - [deleteCampaign](#deletecampaign)
  - [deleteReward](#deletereward)
  - [updateManager](#updatemanager)
  - [publishCampaign](#publishcampaign)
  - [contribute](#contribute)
  - [refund](#refund)
  - [launchProposalContract](#launchproposalcontract)
  - [setProposal](#setproposal)
  - [releaseProposalFunds](#releaseproposalfunds)
  - [getContractUSDCBalance](#getcontractusdcbalance)
  - [checkRewardInventory](#checkrewardinventory)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| usdcToken | contract IERC20 |
| rewardsCounter | uint8 |
| createAt | uint64 |
| totalRaised | uint128 |
| manager | address |
| factory | address |
| proposal | address |
| escrowContract | address |
| status | enum ICampaign.WorkflowStatus |
| rewardsList | mapping(uint8 => struct ICampaign.Rewards) |
| rewardToContributor | mapping(uint8 => mapping(address => uint8)) |
| contributorBalances | mapping(address => uint128) |


## Modifiers

### isNotDeleted
No description


#### Declaration
```solidity
  modifier isNotDeleted
```


### onlyManager
No description


#### Declaration
```solidity
  modifier onlyManager
```


### checkStatus
No description


#### Declaration
```solidity
  modifier checkStatus
```


### checkCampaignDeadline
No description


#### Declaration
```solidity
  modifier checkCampaignDeadline
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



### getCampaignInfo
Returns the campaign information in the struct Info plus de createAt and the managerAddress.


#### Declaration
```solidity
  function getCampaignInfo(
  ) external isNotDeleted returns (struct ICampaign.Info, uint64, address, enum ICampaign.WorkflowStatus, uint128, address)
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |



### updateCampaign
Update the campaign information in the struct Info.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateCampaign(
    struct ICampaign.Info updatedInfoData
  ) external isNotDeleted onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |
| checkStatus |

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
  ) external isNotDeleted onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |
| checkStatus |

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
  ) external isNotDeleted onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newRewardData` | struct ICampaign.Rewards | Rewards Object that contains the new data to set following the Rewards struct for the campaign
|`rewardIndex` | uint8 | uint256 Index of the reward to update

### deleteCampaign
Delete the campaign.

> It's the entry point for deleting a campaign. Only the manager must be able to call it

#### Declaration
```solidity
  function deleteCampaign(
  ) public isNotDeleted onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |



### deleteReward
Delete a reward by its Id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function deleteReward(
    uint8 rewardIndex
  ) external isNotDeleted onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |
| checkStatus |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rewardIndex` | uint8 | uint256 Index of the reward to delete

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

### publishCampaign
Allow the manager to publish campaign and make it visible to potential contributors.

> Only the manager must be able to call it and only within acceptable deadlineDate timeframe.

#### Declaration
```solidity
  function publishCampaign(
  ) external isNotDeleted onlyManager checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| onlyManager |
| checkStatus |



### contribute
Allow contributors to contribute to the campaign.

> Can only be called if campaign is published, is not completed, is not deleted and is not failed.

#### Declaration
```solidity
  function contribute(
  ) external isNotDeleted checkCampaignDeadline
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| checkCampaignDeadline |



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
  ) external onlyManager isNotDeleted checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |
| isNotDeleted |
| checkStatus |



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



### getContractUSDCBalance
Return the amount in USDC raised by the campaign

> amount uint USDC raised by the campaign in WEI

#### Declaration
```solidity
  function getContractUSDCBalance(
  ) public returns (uint128)
```

#### Modifiers:
No modifiers



### checkRewardInventory
Return true if reward inventory > 0 and false if = 0



#### Declaration
```solidity
  function checkRewardInventory(
    uint8 rewardIndex
  ) internal returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`rewardIndex` | uint8 | is rewardi id



