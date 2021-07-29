// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TestUSDC is ERC20, Ownable {
    uint256 private _totalSupply;
    uint8 private _decimals;

    constructor(address receiver) ERC20("TestUSDC", "TUSDC") {
        _decimals = 2;
        _totalSupply = 100000000000000000000000;
        _mint(receiver, _totalSupply);
    }
}