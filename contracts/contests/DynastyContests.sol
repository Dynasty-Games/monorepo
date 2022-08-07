// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import './DynastyContestsStorageUpgradeable.sol';

contract DynastyContests is Initializable, AccessControlUpgradeable, DynastyContestsStorageUpgradeable {
  bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
  bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
  
  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  function initialize() initializer public {
    __AccessControl_init();
    __DynastyContestsStorage_init();

    _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    _grantRole(PAUSER_ROLE, _msgSender());
    _grantRole(MANAGER_ROLE, _msgSender());
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
    require(hasRole(MANAGER_ROLE, _msgSender()) || _portfolios[category_][style_][competitionId][_msgSender()].submits != 0, 'not allowed');
    return _members[category_][style_][competitionId];
  }

  function memberPortfolio(uint256 category_, uint256 style_, uint256 competitionId, address member) public view returns (Portfolio memory) {
    require(hasRole(MANAGER_ROLE, _msgSender()) || _portfolios[category_][style_][competitionId][_msgSender()].submits != 0, 'not allowed');
    return _portfolios[category_][style_][competitionId][member];
  }

  /** 
  * suhbmits portfolio
  * @dev tokenId is included so we can switch credit token if needed
  * 0 = DynastyCredit
  */
  function submitPortfolio(uint256 category_, uint256 style_, uint256 competitionId_, string[] memory items, uint256 withCredits_) public {    
    Competition memory competition_ = _competitions[category_][style_][competitionId_];
    require(withCredits_ == 1 || withCredits_ == 0, 'with credits can only be 0 or 1');
    require(competition_.startTime < block.timestamp, 'competition not started');
    require(competition_.liveTime > block.timestamp, 'competition already live or ended');

    require(items.length == competition_.portfolioSize, 'Invalid portfolioSize');
    Portfolio memory portfolio = _portfolios[category_][style_][competitionId_][_msgSender()];
    
    if (portfolio.submits != 0 && portfolio.submits <= competition_.freeSubmits) {
      // todo implement metatx
    } else {
      uint256 _price = competition_.price;
      if (withCredits_ == 1) {
        uint256 _balance = _token.balanceOf(_msgSender());
        if (_balance > _price) {
          _token.burnFrom(_msgSender(), _price);
          _price = 0;
        } else {
          _price = _price - _balance;
          _token.burnFrom(_msgSender(), _balance);
        }
      }
      
      if (_price > 0) {
        _treasury.deposit(_msgSender(), _price);

        uint256 fee = _styles[style_].fee;
        uint256 amount = _price - ((_price / 100) * fee);

        unchecked {
          _competitions[category_][style_][competitionId_].prizePool += amount;  
        }
      }      
    }
  
    if (portfolio.submits == 0) {
      _members[category_][style_][competitionId_].push(_msgSender());
    }

    portfolio.submits += 1;
    portfolio.items = items;
    _portfolios[category_][style_][competitionId_][_msgSender()] = portfolio;

    emit SubmitPortfolio(category_, style_, competitionId_, _msgSender());
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
