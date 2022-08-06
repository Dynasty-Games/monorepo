


interface IUpgradeableProxy {
  function implementation() external returns (address);
  function admin() external returns (address);
  function changeAdmin(address) external;
  function upgradeTo(address) external;
  function upgradeToAndCall(address, bytes32) external;
}




contract ProxyManager {
  address internal _manager;

  constructor() {
    _setManager(msg.sender);
  }

  event ManagerChanged(address previuos, address current);

  modifier onlyManager() {
    require(msg.sender == _manager, 'NOT_MANAGER');
    _;
  }

  function changeManager(address manager_) external onlyManager {
    _setManager(manager_);
  }

  function _setManager(address manager_) internal {
    emit ManagerChanged(_manager, manager_);
    _manager = manager_;
  }

  function upgrade(IUpgradeableProxy proxy, address implementation) external virtual onlyManager {
    IUpgradeableProxy(proxy).upgradeTo(implementation);
  }

  function upgradeAndCall(IUpgradeableProxy proxy, address implementation, bytes32 data) external virtual onlyManager {
    IUpgradeableProxy(proxy).upgradeToAndCall(implementation, data);
  }

  /**
  * set new ProxyManager
  */
  function changeProxyManager(IUpgradeableProxy proxy, address proxyManager) external virtual onlyManager {
    IUpgradeableProxy(proxy).changeAdmin(proxyManager);
  }
}
