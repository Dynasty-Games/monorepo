// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "node_modules/@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import './../interfaces/ITreasury.sol';
import './../interfaces/IMintable.sol';

contract DynastyContestsStorageUpgradeable is Initializable {
  enum States {
    OPEN,
    CLOSED
  }
  
  /**
    * @dev extraData used to config for example the marketcap needed, max items etc
    */
  struct Competition {
    string name;
    uint256 id;
    uint256 price;
    uint256 prizePool;
    uint256 portfolioSize;
    uint256 freeSubmits;
    uint256 startTime;
    uint256 liveTime;
    uint256 endTime;
    bytes extraData;
    address[] members;
    States state;
  }

  struct Portfolio {
    string[] items;
    uint256 submits;
  }

  struct Style {
    string name;
    uint256 fee;
  }

  mapping (uint256 => mapping(uint256 => mapping (uint256 => Competition))) internal _competitions;
  mapping (uint256 => mapping(uint256 => mapping (uint256 => mapping (address => Portfolio)))) internal _portfolios;
  mapping (uint256 => mapping(uint256 => uint256)) internal _totalCompetitions;
  mapping (uint256 => mapping(uint256 => mapping (uint256 => address[]))) internal _members;

  ITreasury internal _treasury;
  IMintable internal _token;

  uint256 internal _categoriesLength;
  uint256 internal _stylesLength;
  mapping (uint256 => Style) internal _styles;
  mapping (uint256 => string) internal _categories;

  event StyleChange(uint256 indexed id, string name);
  event CategoryChange(uint256 indexed id, string name);
  event TreasuryChange(address erc20Token);
  event SubmitPortfolio(uint256 category_, uint256 style_, uint256 competitionId_, address member_);
  constructor() {
    _disableInitializers();
  }
  function __DynastyContestsStorage_init() internal onlyInitializing { }
}