// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.5;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestUSDC is ERC20, Ownable {
    uint256 private _totalSupply;
    uint8 private _decimals;

    constructor() ERC20("TestUSDC", "TUSDC") {
        _decimals = 2;
        _totalSupply = 10000000000000000000000;
        _mint(0xB33BF581eBA32Df2d577D9c108f0470Eaf96FD6b, _totalSupply);
    }
}