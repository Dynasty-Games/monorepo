// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/** 
 * Fake USDC limited to mint by MINTER only
 * All Fake USDC can be burned by the MINTER
 */
contract FakeUSDC is ERC20, ERC20Burnable, AccessControl {
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  constructor() ERC20('FakeUSDC', 'FUSDC') {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
    _mint(to, amount);
  }

  function minterBurn(address from, uint256 amount) public onlyRole(MINTER_ROLE) {
    _burn(from, amount);
  }

  function decimals() public view virtual override(ERC20) returns (uint8) {
    return 8;
  }
}
