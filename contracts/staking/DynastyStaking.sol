// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "node_modules/@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import './StakingStorageUpgradeable.sol';

contract DynastyStaking is Initializable, StakingStorageUpgradeable, ERC20Upgradeable, PausableUpgradeable, AccessControlUpgradeable {  
    using EnumerableSetUpgradeable for EnumerableSetUpgradeable.AddressSet;
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

      _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
      _grantRole(PAUSER_ROLE, _msgSender());
      _grantRole(MINTER_ROLE, _msgSender());
    }

    function decimals() public view virtual override returns (uint8) {
      return 18;
    }

    /**
    * @dev period the tokens get staked
    */
    function setPeriod(uint256 id_, uint256 period_) public onlyRole(DEFAULT_ADMIN_ROLE) {      
      if (_periods[id_] == 0) _stakeTimes += 1;
      _periods[id_] = period_;      
      if (_periods[id_] == 0) _stakeTimes -= 1;
      emit PeriodChange(id_, period_);
    }

    /**
    * @dev token to stake
    */
    function setToken(address token_) public onlyRole(DEFAULT_ADMIN_ROLE) {
      _token = IMintable(token_);
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
      bytes32 id = keccak256(abi.encodePacked(owner, releaseTime_));
      _stakeIds[owner].push(id);
      _stakes[owner][id] = amount;
      _times[id] = releaseTime_;

      _mint(owner, amount);

      if (balanceOf(owner) == 0) {
        _holders.add(owner);
      }
    }

    function unstake(bytes32 id) public {
      address owner = _msgSender();
      uint256 amount = _stakes[owner][id];

      require(_claimed[id] == 0, "already withdrawn");
      require(_times[id] < block.timestamp, "release time is before current time");
      
      _claimed[id] = 1;
      _burn(owner, amount);

      if (balanceOf(owner) == 0) {
        _holders.remove(owner);
      }
    }

    function claimed(bytes32 id) public view virtual returns (bool) {
      return _claimed[id] == 1 ? true : false;
    }

    function stakeAmount(address sender, bytes32 id) public view virtual returns (uint256) {
      return _stakes[sender][id];
    }

    function period(uint256 id_) public view virtual returns (uint256) {
      return _periods[id_];
    }

    function holders() public view virtual returns (address[] memory) {
      return _holders.values();
    }

    function stakeIds(address sender) public view virtual returns (bytes32[] memory) {
      return _stakeIds[sender];
    }

    function readyToRelease(bytes32 id) public view virtual returns (bool) {
      return _times[id] < block.timestamp ? true : false;
    }

    function stakeReleaseTime(bytes32 id) public view virtual returns (uint256) {
      return _times[id];
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
      internal
      whenNotPaused
      override
    {
      super._beforeTokenTransfer(from, to, amount);
    }
}