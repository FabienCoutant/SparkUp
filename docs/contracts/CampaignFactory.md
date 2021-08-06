# CampaignFactory


The Campaign factory is used for save the list of campaign deployed and also deploy proposal contract

> Inherit of for the CampaignFactory Interface

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Modifiers](#modifiers)
  - [onlyOwner](#onlyowner)
- [Functions](#functions)
  - [addCampaign](#addcampaign)
  - [deleteCampaign](#deletecampaign)
  - [deployProposalContract](#deployproposalcontract)
  - [updateOwner](#updateowner)
  - [setCampaignCreator](#setcampaigncreator)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| campaignCounter | uint128 |
| owner | address |
| campaignCreatorContract | address |
| deployedCampaigns | mapping(uint128 => address) |
| campaignToId | mapping(address => uint128) |


## Modifiers

### onlyOwner
No description


#### Declaration
```solidity
  modifier onlyOwner
```



## Functions

### addCampaign
Add campaign contract address to mapping



#### Declaration
```solidity
  function addCampaign(
    contract ICampaign _newCampaign
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_newCampaign` | contract ICampaign | The address of the campaign created from the campaignCreator

### deleteCampaign
Delete a new Campaign that call this function.

> Only an contract already deployed must be able to call this function

#### Declaration
```solidity
  function deleteCampaign(
  ) public
```

#### Modifiers:
No modifiers



### deployProposalContract
Deploy the proposal contract for a campaign.

> Can only be called by an existing campaign contract.

#### Declaration
```solidity
  function deployProposalContract(
    address _manager
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_manager` | address | The campaign manager address.


### updateOwner
Allow the owner to set a new owner for the factory.

> Only the actual owner must be able to call this function


#### Declaration
```solidity
  function updateOwner(
    address _newOwner
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_newOwner` | address | The new owner address

### setCampaignCreator
Allow the owner to set campaignCreator contract address.

> Only the actual owner must be able to call this function


#### Declaration
```solidity
  function setCampaignCreator(
    address _campaignCreatorContract
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_campaignCreatorContract` | address | The campaignCreator contract address



