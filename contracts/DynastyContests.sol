// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './interfaces/ITreasury.sol';

contract DynastyContests is ERC1155, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    
    enum States {
      OPEN,
      CLOSED
    }

    struct Competition {
      string name;
      uint256 price;
      uint256 prizePool;
      uint256 portfolioSize;
      uint256 freeSubmits;
      uint256 startTime;
      uint256 liveTime;
      uint256 endTime;
      States state;
    }

    struct Portfolio {
      string[] items;
      uint256 submits;
    }

    mapping (uint256 => uint256) internal _totalSupply;
    mapping (uint256 => string) internal _uris;
    mapping (uint256 => mapping(uint256 => mapping (uint256 => Competition))) internal _competitions;
    mapping (uint256 => mapping(uint256 => mapping (uint256 => mapping (address => Portfolio)))) internal _portfolios;
    mapping (uint256 => mapping(uint256 => uint256)) internal _totalCompetitions;
    mapping (uint256 => mapping(uint256 => mapping (uint256 => address[]))) internal _members;

    ITreasury internal _treasury;
    /** 
     * @dev only contains tokens, a token can be nonfungible or fungible
     * token[0] = DynastyCredit
     * token[1] = DynastySpecialNFT
     */    
    string[] internal _tokens;
    uint256 internal _categoriesLength;
    uint256 internal _stylesLength;
    mapping (uint256 => string) internal _styles;
    mapping (uint256 => string) internal _categories;

    event TokenAdded(uint256 indexed id, string name);
    event StyleChange(uint256 indexed id, string name);
    event CategoryChange(uint256 indexed id, string name);
    event TreasuryChange(address erc20Token);

    constructor(string memory uri_) ERC1155(uri_) {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MINTER_ROLE, msg.sender);
      _grantRole(MANAGER_ROLE, msg.sender);

      _addToken(0, 'DynastyCredit');
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
    function submitPortfolio(uint256 category_, uint256 style_, uint256 competitionId, string[] memory items) public {
      Competition memory competition_ = _competitions[category_][style_][competitionId];

      require(competition_.startTime < block.timestamp, 'competition not started');
      require(competition_.liveTime > block.timestamp, 'competition already live or ended');

      require(items.length == competition_.portfolioSize, 'Invalid portfolioSize');
      Portfolio memory portfolio = _portfolios[category_][style_][competitionId][msg.sender];
      

      if (portfolio.submits != 0 && portfolio.submits <= competition_.freeSubmits) {
        // todo implement metatx
      } else {        
        _treasury.deposit(msg.sender, competition_.price * 10**8);
      
        uint256 amount = competition_.price - (competition_.price / 100 * _treasury.fee());
        competition_.prizePool += amount;
      }
    
      if (portfolio.submits == 0) {
        _members[category_][style_][competitionId].push(msg.sender);
      }

      portfolio.submits += 1;
      portfolio.items = items;
      _portfolios[category_][style_][competitionId][msg.sender] = portfolio;
    }
    
    function category(uint256 id) public  view returns (string memory) {
      return _categories[id];
    }

    function style(uint256 id) public view returns (string memory) {
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

    // function createCompetition(uint256 category_, uint256 style_, string memory name, uint256 price, uint256 prizePool, uint256 portfolioSize, uint256 submits, uint256 startTime, uint256 liveTime, uint256 endTime) public onlyRole(MANAGER_ROLE) {
    //   _createCompetition(category, style, name, price, prizePool, portfolioSize, submits, startTime, liveTime, endTime);
    // }    

    function _createCompetition(uint256 category_, uint256 style_, string memory name, uint256 price, uint256 prizePool, uint256 portfolioSize, uint256 submits, uint256 startTime, uint256 liveTime, uint256 endTime) internal {      
      require(bytes(_styles[style_]).length > 0, 'Style does not exist');
      require(bytes(_categories[category_]).length > 0, 'Category does not exist');

      require(startTime > block.timestamp, 'invalid startTime');
      require(liveTime > startTime, 'invalid liveTime');
      require(endTime > liveTime, 'invalid endTime');

      Competition memory competition_;
      competition_.name = name;
      competition_.price = price;
      competition_.prizePool = prizePool;
      competition_.portfolioSize = portfolioSize;
      competition_.freeSubmits = submits;
      competition_.startTime = startTime;
      competition_.liveTime = liveTime;
      competition_.endTime = endTime;
      competition_.state = States.OPEN;
      
      _totalCompetitions[category_][style_] += 1;

      uint256 competitionsId = _totalCompetitions[category_][style_] - 1;
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
      uint256[] memory endTimes_
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
          endTimes_[i]
        );
      }
    }

    function _closeCompetition(uint256 category_, uint256 style_, uint256 competitionId_, uint256[] memory amounts_, address[] memory members_, uint256 tokenId_) internal {
      Competition memory competition_ = _competitions[category_][style_][competitionId_];
      require(competition_.endTime < block.timestamp, 'Competition not ready to close');
      _competitions[category_][style_][competitionId_].state = States.CLOSED;

      uint256 _amounts;
      for (uint256 i = 0; i < amounts_.length; i++) {
        _amounts + amounts_[i];
        _mint(members_[i], tokenId_, amounts_[i], '');
      }
      require(_amounts == competition_.prizePool, 'invalid reward distribution');
    }

    function closeCompetitionBatch(uint256[] memory categories_, uint256[] memory styles_, uint256[] memory competitionIds_, uint256[] memory amounts, address[] memory members_, uint256 tokenId_) public onlyRole(MANAGER_ROLE) {
      require(amounts.length == members_.length, 'Invalid payout length');

      for (uint256 i = 0; i < categories_.length; i++) {
        _closeCompetition(
          categories_[i],
          styles_[i],
          competitionIds_[i],
          amounts,
          members_,
          tokenId_
        );
      }
    }

    function tokens() public view returns (string[] memory) {
      return _tokens;
    }

    function _addToken(uint256 id, string memory name) internal {
      require(_tokens.length == id, 'TokenId to high or to low');
      
      _tokens.push(name);
      emit TokenAdded(id, name);
    }

    function addToken(uint256 id, string memory name) public onlyRole(MANAGER_ROLE) {
      _addToken(id, name);
    }

    function addStyle(uint256 style_, string memory name) public onlyRole(MANAGER_ROLE) {
      require(bytes(_styles[style_]).length == 0, 'style already taken');
      _styles[style_] = name;
      _stylesLength += 1;
      emit StyleChange(style_, name);
    }

    function addCategory(uint256 category_, string memory name) public onlyRole(MANAGER_ROLE) {
      require(bytes(_categories[category_]).length == 0, 'category already taken');
      _categories[category_] = name;
      _categoriesLength += 1;
      emit CategoryChange(category_, name);
    }

    function replacestyle(uint256 style_, string memory name) public onlyRole(MANAGER_ROLE) {
      require(bytes(_styles[style_]).length > 0, 'style does not exist');      
      _styles[style_] = name;
      emit StyleChange(style_, name);
    }

    function replaceCategory(uint256 category_, string memory name) public onlyRole(MANAGER_ROLE) {
      require(bytes(_categories[category_]).length > 0, 'category does not exist');      
      _categories[category_] = name;
      emit CategoryChange(category_, name);
    }

    function setTreasury(address treasury) public onlyRole(MANAGER_ROLE) {
      _treasury = ITreasury(treasury);
      emit TreasuryChange(treasury);
    }

    function totalSupply(uint256 id) public view returns (uint256) {
      return _totalSupply[id];
    }

    function setURI(uint256 id, string memory uri) public onlyRole(MANAGER_ROLE) {
      _uris[id] = uri;
      emit URI(uri, id);
    }

    function setURI(uint256 id) public view returns (string memory) {
      return _uris[id];
    }

    function pause() public onlyRole(PAUSER_ROLE) {
      _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
      _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
      public
      onlyRole(MINTER_ROLE)
    {
      _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
      public
      onlyRole(MINTER_ROLE)
    {
      _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
      internal
      whenNotPaused
      override(ERC1155)
    {
      super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
      
      if (from == address(0)) {
        for (uint256 i = 0; i < ids.length; ++i) {
          _totalSupply[ids[i]] += amounts[i];
        }
      }

      if (to == address(0)) {
        for (uint256 i = 0; i < ids.length; ++i) {
          uint256 id = ids[i];
          uint256 amount = amounts[i];
          uint256 supply = _totalSupply[id];
          require(supply >= amount, "ERC1155: burn amount exceeds totalSupply");
          unchecked {
            _totalSupply[id] = supply - amount;
          }
        }
      }
    }

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
      public
      view
      override(ERC1155, AccessControl)
      returns (bool)
    {
      return super.supportsInterface(interfaceId);
    }
}
