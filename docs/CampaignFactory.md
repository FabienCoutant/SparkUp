# CampaignFactory


The Campaign factory is used for the deployment of new campaign

> Inherit of for the CampaignFactory Interface

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Functions](#functions)
  - [createCampaign](#createcampaign)
  - [deleteCampaign](#deletecampaign)
  - [updateOwner](#updateowner)
  - [getDeployedCampaignsList](#getdeployedcampaignslist)
  - [getLastDeployedCampaignsIndex](#getlastdeployedcampaignsindex)
- [Events](#events)
  - [newCampaign](#newcampaign)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| owner | address |
| deployedCampaigns | contract ICampaign[] |
| contractIndex | mapping(address => uint256) |
| contractExist | mapping(address => bool) |



## Functions

### createCampaign
Create a new Campaign contract and init it



#### Declaration
```solidity
  function createCampaign(
    struct ICampaign.Info infoData,
    struct ICampaign.Rewards[] rewardsData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`infoData` | struct ICampaign.Info | ICampaign.Info basic information for a campaign following the Campaign Info structure
|`rewardsData` | struct ICampaign.Rewards[] | ICampaign.Rewards array of rewards information for a campaign following the Campaign Info structure

### deleteCampaign
Delete a new Campaign that call this function.

> Only an contract already deployed must be able to call this function


#### Declaration
```solidity
  function deleteCampaign(
  ) public returns (bool)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`success` | bool
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

### getDeployedCampaignsList
Allow to get the all list of campaign address deployed



#### Declaration
```solidity
  function getDeployedCampaignsList(
  ) external returns (contract ICampaign[])
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`Campaigns` | ICampaign[] list of campaigns address deployed and still actives
### getLastDeployedCampaignsIndex
Helper to get the index of the last campaign deployed



#### Declaration
```solidity
  function getLastDeployedCampaignsIndex(
  ) internal returns (uint256)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`index` | uint index of the last elem of the deployedCampaigns array


## Events

### newCampaign
No description




