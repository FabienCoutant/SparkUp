// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
* @title Escrow
* @notice The Escrow is used to store the fees coming from succeed campaign
*/
contract Escrow is Ownable {

    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdcToken;

    constructor(address _usdcToken){
        usdcToken = IERC20(_usdcToken);
    }

    /**
     * @notice Transfer amount of fees collected to an address
     * @dev Using safeTransfer from SafeERC20
     * @param _recipient The address of the receiver
     * @param _amount The amount the transfer
     */
    function transfer(address _recipient, uint256 _amount) external onlyOwner() {
        usdcToken.safeTransfer(_recipient, _amount);
    }

    /**
    * @notice Approve the amount that a _spender can access
    * @dev Use for transferFrom or safeTransferFrom in case we allow someone to pull over push
    * @param _spender The address of the receiver
    * @param _amount The amount the transfer
    */
    function approve(address _spender, uint256 _amount) external onlyOwner() {
        usdcToken.safeIncreaseAllowance(_spender, _amount);
    }

    /**
    * @notice Getter that return the amount allow that the _spender can used from the _owner address
    * @param _owner The address of the owner
    * @param _spender The address of the receiver
    * @return amount The amount that _spender can used from the _owner address
    */
    function allowance(address _owner, address _spender) external view returns (uint256) {
        return usdcToken.allowance(_owner, _spender);
    }

    /**
    * @notice Getter that return current balance of the escrow contract
    * @dev Note that USDC using 6 decimals instead of 18
    * @return Balance The amount of USDC in the contract
    */
    function getContractUSDCBalance() external view returns(uint) {
        return usdcToken.balanceOf(address(this));
    }
}
