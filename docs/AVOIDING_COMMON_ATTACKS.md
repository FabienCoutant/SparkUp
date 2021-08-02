# Avoiding Common Attacks

📌 The common attacks listed below are a mix of Alyra security courses and [Consensys](https://consensys.github.io/smart-contract-best-practices/known_attacks/)

*:information_source: Attacks applicable to this application are checks*  

- [x] [Reentrancy](#Reentrancy)
- [ ] [Front Running](#Front-Running)
- [x] [Timestamp Dependence](#Timestamp-Dependence)
- [x] [Overflow and Underflow](#Overflow-and-Underflow)
- [x] [DoS with (Unexpected) revert](#DoS-with-(Unexpected)-revert)
- [x] [DoS with Block Gas Limit](#DoS-with-Block-Gas-Limit)
- [ ] [Insufficient gas griefing](#Insufficient-gas-griefing)
- [ ] [Forcibly Sending Ether to a Contract](#Forcibly-Sending-Ether-to-a-Contract)
- [x] [Call to the unknown](#Call-to-the-unknown)
- [ ] [Source of Randomness](#Source-of-Randomness)
- [ ] [tx.origin](#tx.origin)
- [ ] [Honeypot](#Honeypot)


## Reentrancy

* The only external contract used is the official USDC ERC-20 contract which is used through the SafeERC20 library.

* We are not using `address.call()` function but SafeERC20 safeTransfer() and safeTransferFrom() instead.

* We limit the access to certain functionalities thanks to **modifiers** and **workflow**

```
    modifier isNotDeleted(){
        require(status != WorkflowStatus.CampaignDeleted, "!Err: Campaign Deleted");
        _;
    }

    modifier onlyManager(){
        require(msg.sender == manager, "!Not Authorized");
        _;
    }

    modifier checkStatus(
        WorkflowStatus currentStatus,
        WorkflowStatus requiredStatus
    ) {
        require(currentStatus == requiredStatus, "!Err : Wrong workflow status");
        _;
    }
    
    modifier checkCampaignDeadline() {
        require(block.timestamp <  campaignInfo.deadlineDate, "!Err : Campaign contribution has ended");
        _;
    }
    
```

## Front Running

This attack isn't applicable to our application.

## Timestamp Dependence

We are using timestamp on several parts of the workflow. To avoid this attack we took some best practices:
* Using `block.timestamp` instead of `now` or `block.number`
  
* Using timestamp comparison (>, <, >=, <=) instead of strict equal

* Our application isn't impacted by the 15 seconds rule because the minimum time between action and deadline is 7 days.

## Overflow and Underflow

We are avoiding this attack directly by using solidity version greater than 0.8.0 ([reference](https://docs.soliditylang.org/en/v0.8.0/080-breaking-changes.html#silent-changes-of-the-semantics))

## Accessing Private Data

Our application doesn't handle private data or sensible data. Everything is public.

## DoS with (Unexpected) revert

Our application use pull over push payment in order to prevent this attack.

## DoS with Block Gas Limit

We are avoiding this attack with two solutions : 
* using pull over push payment as the previous attack.
* limiting the number of array length for data set (example: the max level of Rewards is 10).

## Insufficient gas griefing

This attack isn't applicable to our application because it does not use the low level `call()` function.

## Forcibly Sending Ether to a Contract

This attack isn't applicable to our application because it does not handle contribution with Ether but USDC.

## Call to the unknown

We are avoiding this attack by : 
* not using the low level `call()` neither `delegatecall()` functions
* using interfaces in order to instance other contracts.

## Source of Randomness

This attack isn't applicable to our application because it does have any random usage.  

## tx.origin

This attack isn't applicable to our application because it does use tx.origin.  

## Honeypot

This attack isn't applicable to our application.
