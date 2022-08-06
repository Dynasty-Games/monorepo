// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import 'node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IMintable {
  function mint(address to_, uint256 amount_) external;

  function burn(uint256 amount_) external;

  function burnFrom(address from_, uint256 amount_) external;
}