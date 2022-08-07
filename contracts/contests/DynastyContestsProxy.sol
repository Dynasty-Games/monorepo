// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "node_modules/@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";
import './DynastyContestsStorage.sol';

contract DynastyContestsProxy is TransparentUpgradeableProxy, DynastyContestsStorage {
  constructor(address logic, address admin, bytes memory data) TransparentUpgradeableProxy(logic, admin, data) {}
}