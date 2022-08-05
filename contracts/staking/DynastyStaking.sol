// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract DynastyStaking is Initializable, StakingStorage, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable {   
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
      _disableInitializers();
    }

    function initialize() initializer public {
      __ERC20_init("DynastyStaking", "DFMS");
      __Pausable_init();
      __AccessControl_init();

      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
    * @dev period the tokens get staked
    */
    function setPeriod(uint256 id_, uint256 period_) public onlyRole(DEFAULT_ADMIN_ROLE) {      
      if (_periods[id_] == 0) _stakeTimes += 1;
      _periods[id_] = period;      
      if (_periods[id_] == 0) _stakeTimes -= 1;
      emit PeriodChange(id_, period_);
    }

    /**
    * @dev token to stake
    */
    function setToken(address token_) public onlyRole(DEFAULT_ADMIN_ROLE) {
      _token = IDynastyFantasyManager(token_);
      emit TokenChange(token_);
    }

    function pause() public onlyRole(PAUSER_ROLE) {
      _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
      _unpause();
    }

    function _mint(address to_, uint256 amount_) internal override {
      _token.burnFrom(to_, amount_);
      super._mint(to_, amount_);
    }

    function _burn(address from_, uint256 amount_) internal override {   
      _token.mint(from_, amount_);   
      super._burn(from_, amount_);
    }

    function stakeTimes() public view returns (uint256[] memory stakeTimes_) {
      stakeTimes_ = new uint256[](_stakeTimes);

      for (uint256 i = 0; i < _stakeTimes; i++) {
        stakeTimes_[i] = _periods[i];
      }

      return stakeTimes_;
    }

    function stake(uint256 amount, uint256 period_) public {
      address owner = _msgSender();
      uint256 releaseTime_ = block.timestamp + _periods[period_];
      bytes32 id = keccak256(abi.encodePacked(sender, releaseTime_));
      _stakeIds[owner].push(id);
      _stakes[owner][id] = amount;
      _times[owner][id] = releaseTime_;

      _mint(owner, amount);

      if (balanceOf(owner) == 0) {
        _holders.add(owner);
      }
    }

    function unstake(uint256 amount, bytes32 id) public {
      address owner = _msgSender();
      require(_claimed[owner][id] == 0, "already withdrawn");
      require(_times[owner][id] < block.timestamp, "release time is before current time");
      
      _claimed[sender][id] = 1;
      _burn(owner, amount);

      if (balanceOf(owner) == 0) {
        _holders.remove(owner);
      }
    }

    function claimed(address sender, bytes32 id) public view virtual returns (bool) {
      return _claimed[sender][id] == 1 ? true : false;
    }

    function stakeAmount(address sender, bytes32 id) public view virtual returns (uint256) {
      return _stakes[sender][id];
    }

    function period(uint256 id_) public view virtual returns (uint256) {
      return _periods[id];
    }

    function holders() public view virtual returns (address[] memory) {
      return _holders.value();
    }

    function stakeIds(address sender) public view virtual returns (bytes32[] memory) {
      return _stakeIds[sender];
    }

    function readyToRelease(address sender, bytes32 id) public view virtual returns (bool) {
      return _times[sender][id] < block.timestamp ? true : false;
    }

    function stakeReleaseTime(address sender, bytes32 id) public view virtual returns (uint256) {
      return _times[sender][id];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
      internal
      whenNotPaused
      override
    {
      super._beforeTokenTransfer(from, to, amount);
    }
}