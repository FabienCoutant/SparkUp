# CampaignCreator


The CampaignCreator is used for the deployment of new campaign

> Using this Contract make the CampaignFactory contract lighter

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Functions](#functions)
  - [constructor](#constructor)
  - [createCampaign](#createcampaign)
- [Events](#events)
  - [newCampaign](#newcampaign)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
| factory | address |
| escrow | address |
| factoryContract | contract ICampaignFactory |
| usdcToken | contract IERC20 |



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



### createCampaign
Deploy a new campaign contract and push it address to the Campaign Factory contract

> The function emit an event that return the address to the DApp for state update


#### Declaration
```solidity
  function createCampaign(
    struct ICampaign.Info _infoData,
    struct ICampaign.Rewards[] _rewardsData
  ) external
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_infoData` | struct ICampaign.Info | The Info Object that contains data which follow the ICampaign.Info struct
|`_rewardsData` | struct ICampaign.Rewards[] | The array of Rewards Object that contains data which follow the ICampaign.Rewards struct



## Events

### newCampaign
No description




