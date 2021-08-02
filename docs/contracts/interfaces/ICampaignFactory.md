# ICampaignFactory


The Campaign factory facilitate the deployment of new campaigns

> Interface for the CampaignFactory contract

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [addCampaign](#addcampaign)
  - [deployProposalContract](#deployproposalcontract)
  - [deleteCampaign](#deletecampaign)
  - [updateOwner](#updateowner)
  - [setProxy](#setproxy)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




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


### deleteCampaign
Delete a new Campaign that call this function.

> Only an contract already deployed must be able to call this function

#### Declaration
```solidity
  function deleteCampaign(
  ) external
```

#### Modifiers:
No modifiers



### updateOwner
Allow the owner to set a new owner for the factory.

> Only the actual owner must be able to call this function


#### Declaration
```solidity
  function updateOwner(
    address newOwner
  ) external
```

#### Modifiers:
No modifiers

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
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_proxyContract` | address | address the ProxyContract



