// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
* @title TestUSDC
* @notice Reproduce the basic function of the official USDC contract
* @dev This contract is only used for the purpose of local development
*/
contract TestUSDC is ERC20, Ownable {
    uint256 private _totalSupply;

    constructor(address _receiver) ERC20("TestUSDC", "TUSDC") {
        _totalSupply = 100000000000;
        _mint(_receiver, _totalSupply);
    }

    /**
    * @notice Getter that return the number of decimals for the ERC20
    * @dev This getter is used to calculate the right value (ex: metamask token value displayed)
    * @return decimals The number of decimals
    */
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
}
