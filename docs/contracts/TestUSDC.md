# TestUSDC


Reproduce the basic function of the official USDC contract

> This contract is only used for the purpose of local development

## Contents
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Functions](#functions)
  - [constructor](#constructor)
  - [decimals](#decimals)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->




## Functions

### constructor
No description


#### Declaration
```solidity
  function constructor(
  ) public ERC20
```

#### Modifiers:
| Modifier |
| --- |
| ERC20 |



### decimals
Getter that return the number of decimals for the ERC20

> This getter is used to calculate the right value (ex: metamask token value displayed)


#### Declaration
```solidity
  function decimals(
  ) public returns (uint8)
```

#### Modifiers:
No modifiers


#### Returns:
| Type | Description |
| --- | --- |
|`decimals` | The number of decimals


