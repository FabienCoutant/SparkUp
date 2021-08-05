# Escrow


The Escrow is used to store the fees coming from succeed campaign


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
Transfer amount of fees collected to an address

> Using safeTransfer from SafeERC20


#### Declaration
```solidity
  function transfer(
    address _recipient,
    uint256 _amount
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_recipient` | address | The address of the receiver
|`_amount` | uint256 | The amount the transfer

### approve
Approve the amount that a _spender can access

> Use for transferFrom or safeTransferFrom in case we allow someone to pull over push


#### Declaration
```solidity
  function approve(
    address _spender,
    uint256 _amount
  ) external onlyOwner
```

#### Modifiers:
| Modifier |
| --- |
| onlyOwner |

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_spender` | address | The address of the receiver
|`_amount` | uint256 | The amount the transfer

### allowance
Getter that return the amount allow that the _spender can used from the _owner address



#### Declaration
```solidity
  function allowance(
    address _owner,
    address _spender
  ) external returns (uint256)
```

#### Modifiers:
No modifiers

#### Args:
| Arg | Type | Description |
| --- | --- | --- |
|`_owner` | address | The address of the owner
|`_spender` | address | The address of the receiver

#### Returns:
| Type | Description |
| --- | --- |
|`amount` | The amount that _spender can used from the _owner address
### getContractUSDCBalance
Getter that return current balance of the escrow contract

> Note that USDC using 6 decimals instead of 18


#### Declaration
```solidity
  function getContractUSDCBalance(
  ) external returns (uint256)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`Balance` | The amount of USDC in the contract


