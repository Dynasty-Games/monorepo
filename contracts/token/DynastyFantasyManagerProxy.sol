// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "node_modules/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract DynastyFantasyManagerProxy is TransparentUpgradeableProxy {
  constructor(address logic, address admin, bytes memory data) TransparentUpgradeableProxy(logic, admin, data) public {}
}