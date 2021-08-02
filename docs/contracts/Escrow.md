# Escrow


The Campaign factory is used for the deployment of new campaign

> Inherit of for the CampaignFactory Interface

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Variables](#variables)
- [Functions](#functions)
  - [constructor](#constructor)
  - [transfer](#transfer)
  - [approve](#approve)
  - [allowance](#allowance)
  - [getContractUSDCBalance](#getcontractusdcbalance)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Variables

| Var  | Type |
| ---  | --- |
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



### transfer
No description


#### Declaration
```solidity
  function transfer(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### approve
No description


#### Declaration
```solidity
  function approve(
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |



### allowance
No description


#### Declaration
```solidity
  function allowance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers



### getContractUSDCBalance
No description


#### Declaration
```solidity
  function getContractUSDCBalance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers





