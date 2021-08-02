# CampaignFactory


The Campaign factory is used for the deployment of new campaign

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
  - [setProxy](#setproxy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| campaignCounter | uint128 |
| owner | address |
| proxyContract | address |
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
|`_newCampaign` | contract ICampaign | is ICampaign of created campaign from proxy

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
Delete a new proposal contract.

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
|`_manager` | address | is campaign manager.


### updateOwner
Allow the owner to set a new owner for the factory.

> Only the actual owner must be able to call this function


#### Declaration
```solidity
  function updateOwner(
    address newOwner
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`newOwner` | address | address The new owner address

### setProxy
Allow the owner to set ProxyContract address.

> Only the actual owner must be able to call this function


#### Declaration
```solidity
  function setProxy(
    address _proxyContract
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proxyContract` | address | address the ProxyContract



