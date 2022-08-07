// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import './interfaces/ITreasury.sol';
import './interfaces/IMintable.sol';

contract DynastyContests is AccessControl {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
  
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
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MANAGER_ROLE, msg.sender);
  }

  function competition(uint256 category_, uint256 style_, uint256 competitionId) public view returns (Competition memory) {
    return _competitions[category_][style_][competitionId];
  }

  function competitionState(uint256 category_, uint256 style_, uint256 competitionId) public view returns (States) {
    return _competitions[category_][style_][competitionId].state;
  }

  function isLive(uint256 category_, uint256 style_, uint256 competitionId) public view returns (bool) {
    Competition memory competition_ = _competitions[category_][style_][competitionId];
    return competition_.liveTime <= block.timestamp && competition_.endTime >= block.timestamp;
  }

  function totalMembers(uint256 category_, uint256 style_, uint256 competitionId) public view returns (uint256) {
    return _members[category_][style_][competitionId].length;
  }

  function isMember(uint256 category_, uint256 style_, uint256 competitionId, address member_) public view returns (bool) {
    if (_portfolios[category_][style_][competitionId][member_].submits != 0) return true;
    return false;
  }

  function members(uint256 category_, uint256 style_, uint256 competitionId) public view returns (address[] memory) {
    require(hasRole(MANAGER_ROLE, msg.sender) || _portfolios[category_][style_][competitionId][msg.sender].submits != 0, 'not allowed');
    return _members[category_][style_][competitionId];
  }

  function memberPortfolio(uint256 category_, uint256 style_, uint256 competitionId, address member) public view returns (Portfolio memory) {
    require(hasRole(MANAGER_ROLE, msg.sender) || _portfolios[category_][style_][competitionId][msg.sender].submits != 0, 'not allowed');
    return _portfolios[category_][style_][competitionId][member];
  }

  /** 
  * suhbmits portfolio
  * @dev tokenId is included so we can switch credit token if needed
  * 0 = DynastyCredit
  */
  function submitPortfolio(uint256 category_, uint256 style_, uint256 competitionId_, string[] memory items) public {
    Competition memory competition_ = _competitions[category_][style_][competitionId_];

    require(competition_.startTime < block.timestamp, 'competition not started');
    require(competition_.liveTime > block.timestamp, 'competition already live or ended');

    require(items.length == competition_.portfolioSize, 'Invalid portfolioSize');
    Portfolio memory portfolio = _portfolios[category_][style_][competitionId_][msg.sender];
    

    if (portfolio.submits != 0 && portfolio.submits <= competition_.freeSubmits) {
      // todo implement metatx
    } else {
      _treasury.deposit(msg.sender, competition_.price);

      uint256 fee = _styles[style_].fee;
      uint256 amount = competition_.price - ((competition_.price / 100) * fee);

      unchecked {
        _competitions[category_][style_][competitionId_].prizePool += amount;  
      }
      
    }
  
    if (portfolio.submits == 0) {
      _members[category_][style_][competitionId_].push(msg.sender);
    }

    portfolio.submits += 1;
    portfolio.items = items;
    _portfolios[category_][style_][competitionId_][msg.sender] = portfolio;

    emit SubmitPortfolio(category_, style_, competitionId_, msg.sender);
  }
  
  function category(uint256 id) public  view returns (string memory) {
    return _categories[id];
  }

  function style(uint256 id) public view returns (Style memory) {
    return _styles[id];
  }

  function categoriesLength() public  view returns (uint256) {
    return _categoriesLength;
  }

  function stylesLength() public view returns (uint256) {
    return _stylesLength;
  }

  function totalCompetitions(uint256 category_, uint256 style_) public view returns (uint256) {
    return _totalCompetitions[category_][style_];
  }

  function competitionsByCategoryAndStyle(uint256 category_, uint256 style_) public view returns (Competition[] memory) {
    uint256 _size = _totalCompetitions[category_][style_];
    Competition[] memory array = new Competition[](_size);

    for (uint256 i = 0; i < _size; i++) {
      array[i] = _competitions[category_][style_][i];
    }      
    return array;
  }

  function _createCompetition(
    uint256 category_,
    uint256 style_,
    string memory name,
    uint256 price,
    uint256 prizePool,
    uint256 portfolioSize,
    uint256 submits,
    uint256 startTime,
    uint256 liveTime,
    uint256 endTime,
    bytes memory extraData
  ) internal {
    require(bytes(_styles[style_].name).length > 0, 'Style does not exist');
    require(bytes(_categories[category_]).length > 0, 'Category does not exist');
    require(startTime > block.timestamp, 'invalid startTime');
    require(liveTime > startTime, 'invalid liveTime');
    require(endTime > liveTime, 'invalid endTime');

    uint256 competitionsId = _totalCompetitions[category_][style_];

    Competition memory competition_;
    competition_.name = name;
    competition_.id = competitionsId;
    competition_.price = price;
    competition_.prizePool = prizePool;
    competition_.portfolioSize = portfolioSize;
    competition_.freeSubmits = submits;
    competition_.startTime = startTime;
    competition_.liveTime = liveTime;
    competition_.endTime = endTime;
    competition_.extraData = extraData;
    competition_.state = States.OPEN;
    
    _totalCompetitions[category_][style_] += 1;
    
    _competitions[category_][style_][competitionsId] = competition_;
  }

  function createCompetitionBatch(
    uint256[] memory categories_,
    uint256[] memory styles_,
    string[] memory names_,
    uint256[] memory prices_,
    uint256[] memory pricePools_,
    uint256[] memory portfolioSizes_,
    uint256[] memory submits,
    uint256[] memory startTimes_,
    uint256[] memory liveTimes_,
    uint256[] memory endTimes_,
    bytes[] memory extraData_
  ) public onlyRole(MANAGER_ROLE) {
    for (uint256 i = 0; i < categories_.length; i++) {
      
      _createCompetition(
        categories_[i],
        styles_[i],
        names_[i],
        prices_[i],
        pricePools_[i],
        portfolioSizes_[i],
        submits[i],
        startTimes_[i],
        liveTimes_[i],
        endTimes_[i],
        extraData_[i]
      );
    }
  }

  function _closeCompetition(uint256 category_, uint256 style_, uint256 competitionId_, uint256[] memory amounts_, address[] memory members_) internal {    
    require(
      _competitions[category_][style_][competitionId_].endTime < block.timestamp,
      'Competition not ready to close'
    );
    require(
      _competitions[category_][style_][competitionId_].state != States.CLOSED,
      'Competition already closed'
    );

    _competitions[category_][style_][competitionId_].state = States.CLOSED;

    for (uint256 i = 0; i < amounts_.length; i++) {
      _token.mint(members_[i], amounts_[i]);
    }    
  }

  function closeCompetition(uint256 category_, uint256 style_, uint256 competitionId_, uint256[] memory amounts_, address[] memory members_) public onlyRole(MANAGER_ROLE) {
    _closeCompetition(
      category_,
      style_,
      competitionId_,
      amounts_,
      members_
    );
  }

  function token() public view returns (address) {
    return address(_token);
  }

  function setToken(address token_) public onlyRole(MANAGER_ROLE) {
    _token = IMintable(token_);
  }

  function addStyle(uint256 style_, string memory name_, uint256 fee_) public onlyRole(MANAGER_ROLE) {
    require(bytes(_styles[style_].name).length == 0, 'style already taken');      
    _styles[style_].name = name_;
    _styles[style_].fee = fee_;
    _stylesLength += 1;
    emit StyleChange(style_, name_);
  }

  function addCategory(uint256 category_, string memory name_) public onlyRole(MANAGER_ROLE) {
    require(bytes(_categories[category_]).length == 0, 'category already taken');
    _categories[category_] = name_;
    _categoriesLength += 1;
    emit CategoryChange(category_, name_);
  }

  function changeStyle(uint256 style_, string memory name_, uint256 fee_) public onlyRole(MANAGER_ROLE) {
    require(bytes(_styles[style_].name).length > 0, 'style does not exist');      
    _styles[style_].name = name_;
    _styles[style_].fee = fee_;
    emit StyleChange(style_, name_);
  }

  function changeCategory(uint256 category_, string memory name_) public onlyRole(MANAGER_ROLE) {
    require(bytes(_categories[category_]).length > 0, 'category does not exist');      
    _categories[category_] = name_;
    emit CategoryChange(category_, name_);
  }

  function setTreasury(address treasury) public onlyRole(MANAGER_ROLE) {
    _treasury = ITreasury(treasury);
    emit TreasuryChange(treasury);
  }
}
