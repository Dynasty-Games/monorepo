// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITreasury {
  function deposit(address from, uint256 amount) external;
  function fee() external returns(uint256);
}