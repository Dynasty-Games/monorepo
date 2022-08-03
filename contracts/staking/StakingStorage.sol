// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "node_modules/@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "./../token/IDynastyFantasyManager.sol";

contract StakingStorage {
  // Add the library methods
  using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;

  // Declare a set state variable
  EnumerableSetUpgradeable.AddressSet private _holders;

  IDynastyFantasyManager internal _token;
  uint256 internal _stakeTimes;

  mapping (address => bytes32[]) internal _stakeIds;  
  mapping (address => mapping(bytes32 => uint256)) internal _stakes;
  mapping (bytes32 => uint256) internal _times;
  mapping (bytes32 => uint256) internal _claimed;
  mapping (uint256 => uint256) internal _periods;

  event PeriodChange(uint256 id_, uint256 time_);
}