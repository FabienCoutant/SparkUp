# Campaign


The Campaign contract handle the all life for one campaign

> Inherit of for the Campaign Interface

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
  - [getContributorBalances](#getcontributorbalances)

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
|`_updatedInfoData` | struct ICampaign.Info | is The Info Object that contains all the new information following the Info struct for the campaign

### addReward
Add a new reward level to the campaign.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function addReward(
    struct ICampaign.Rewards _newRewardData
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
|`_newRewardData` | struct ICampaign.Rewards | The Rewards Object that contains all the needed information which follow the Rewards struct for the campaign

### updateReward
Update the data of a specific reward regarding its id.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateReward(
    struct ICampaign.Rewards _newRewardData,
    uint8 _rewardIndex
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
|`_newRewardData` | struct ICampaign.Rewards | The rewards Object that contains the new data to set which follow the Rewards struct for the campaign
|`_rewardIndex` | uint8 | The reward's index to update

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
    uint8 _rewardIndex
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
|`_rewardIndex` | uint8 | The reward's index to delete

### updateManager
Allow the manager to setup a new one.

> Only the manager must be able to call it.


#### Declaration
```solidity
  function updateManager(
    address _newManager
  ) external onlyManager
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |

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
    uint128 _amount,
    uint8 _rewardIndex
  ) external isNotDeleted checkCampaignDeadline
```

#### Modifiers:
| Modifier |
| --- |
| isNotDeleted |
| checkCampaignDeadline |

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
  ) external onlyManager isNotDeleted checkStatus
```

#### Modifiers:
| Modifier |
| --- |
| onlyManager |
| isNotDeleted |
| checkStatus |



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
### checkRewardInventory
Return true if reward inventory > 0 and false if = 0

> If the reward if not limited the function return true


#### Declaration
```solidity
  function checkRewardInventory(
    uint8 _rewardIndex
  ) internal returns (bool)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_rewardIndex` | uint8 | The reward's index to check

#### Returns:
| Type | Description |
| --- | --- |
|`bool` | The return of the check
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


