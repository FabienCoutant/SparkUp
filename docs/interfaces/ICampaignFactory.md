# ICampaignFactory


The Campaign factory facilitate the deployment of new campaigns

> Interface for the CampaignFactory contract

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [createCampaign](#createcampaign)
  - [deleteCampaign](#deletecampaign)
  - [updateOwner](#updateowner)
  - [getDeployedCampaignsList](#getdeployedcampaignslist)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




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
  ) external returns (bool)
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


