// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import './IDynastyFantasyManager.sol';

contract DynastyFantasyManager is Initializable, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable, IDynastyFantasyManager {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize() initializer public {
    __ERC20_init("DynastyFantasyManager", "DFM");
    __Pausable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(PAUSER_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function mint(address to_, uint256 amount_) public override onlyRole(MINTER_ROLE) {
    _mint(to_, amount_);
  }

  function burn(uint256 amount_) public override {
    address from_ = _msgSender();
    burnFrom(from_, amount);
  }

  function burnFrom(address from_, uint256 amount_) public override {
    require(hasRole(MINTER_ROLE, _msgSender()) || from_ == _msgSender(), 'not allowed');
    _burn(from_, amount_);
  }

  function _beforeTokenTransfer(address from, address to, uint256 amount)
      internal
      whenNotPaused
      override
    {
      super._beforeTokenTransfer(from, to, amount);
    }
}