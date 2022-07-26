// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FxBaseChildTunnel.sol";

import './interfaces/ITreasury.sol';

contract DynastyContestsChild is Pausable, AccessControl, FxBaseChildTunnel {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    uint256 public latestStateId;
    address public latestRootMessageSender;
    bytes public latestData;

    constructor(address fxChild_) FxBaseChildTunnel(fxChild_) {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
      _grantRole(MANAGER_ROLE, msg.sender);     
    }

    // function setTreasury(address treasury) public onlyRole(MANAGER_ROLE) {
    //   _treasury = ITreasury(treasury);
    //   emit TreasuryChange(treasury);
    // }

    function pause() public onlyRole(PAUSER_ROLE) {
      _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
      _unpause();
    }

    function _processMessageFromRoot(
        uint256 stateId,
        address sender,
        bytes memory data
    ) internal override validateSender(sender) {
        latestStateId = stateId;
        latestRootMessageSender = sender;
        latestData = data;
    }

    function sendMessageToRoot(bytes memory message) public {
      _sendMessageToRoot(message);
    }
}
