// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "node_modules/@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./../interfaces/IMintable.sol";

contract StakingStorageUpgradeable is Initializable {
  constructor() {
    _disableInitializers();
  }
  using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
  EnumerableSetUpgradeable.AddressSet internal _holders;

  IMintable internal _token;
  uint256 internal _stakeTimes;

  mapping (address => bytes32[]) internal _stakeIds;  
  mapping (address => mapping(bytes32 => uint256)) internal _stakes;
  mapping (bytes32 => uint256) internal _times;
  mapping (bytes32 => uint256) internal _claimed;
  mapping (uint256 => uint256) internal _periods;

  event PeriodChange(uint256 id, uint256 time);
  event TokenChange(address token);
}