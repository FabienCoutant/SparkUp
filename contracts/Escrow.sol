// SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
/**
* @title CampaignFactory
* @notice The Campaign factory is used for the deployment of new campaign
* @dev Inherit of for the CampaignFactory Interface
*/
contract Escrow is Ownable {

    using SafeERC20 for IERC20;
    
    IERC20 public immutable usdcToken;

    constructor(address _usdcToken){
        usdcToken = IERC20(_usdcToken);
    }

    function transfer(address recipient, uint256 amount) external onlyOwner() {
        usdcToken.safeTransfer(recipient, amount);
    }

    function approve(address spender, uint256 amount) external onlyOwner() {
        usdcToken.safeIncreaseAllowance(spender, amount);
    }
    
    function allowance(address owner, address spender) external view returns (uint256) {
        return usdcToken.allowance(owner, spender);
    }

    function getContractUSDCBalance() external view returns(uint) {
        return usdcToken.balanceOf(address(this));
    }
}
