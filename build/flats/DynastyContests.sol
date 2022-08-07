
// OpenZeppelin Contracts v4.4.1 (utils/introspection/IERC165.sol)



/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// OpenZeppelin Contracts v4.4.1 (utils/introspection/ERC165.sol)





/**
 * @dev Implementation of the {IERC165} interface.
 *
 * Contracts that want to implement ERC165 should inherit from this contract and override {supportsInterface} to check
 * for the additional interface id that will be supported. For example:
 *
 * ```solidity
 * function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
 *     return interfaceId == type(MyInterface).interfaceId || super.supportsInterface(interfaceId);
 * }
 * ```
 *
 * Alternatively, {ERC165Storage} provides an easier to use but more expensive implementation.
 */
abstract contract ERC165 is IERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC165).interfaceId;
    }
}

// OpenZeppelin Contracts (last updated v4.7.0) (utils/Strings.sol)



/**
 * @dev String operations.
 */
library Strings {
    bytes16 private constant _HEX_SYMBOLS = "0123456789abcdef";
    uint8 private constant _ADDRESS_LENGTH = 20;

    /**
     * @dev Converts a `uint256` to its ASCII `string` decimal representation.
     */
    function toString(uint256 value) internal pure returns (string memory) {
        // Inspired by OraclizeAPI's implementation - MIT licence
        // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation.
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0x00";
        }
        uint256 temp = value;
        uint256 length = 0;
        while (temp != 0) {
            length++;
            temp >>= 8;
        }
        return toHexString(value, length);
    }

    /**
     * @dev Converts a `uint256` to its ASCII `string` hexadecimal representation with fixed length.
     */
    function toHexString(uint256 value, uint256 length) internal pure returns (string memory) {
        bytes memory buffer = new bytes(2 * length + 2);
        buffer[0] = "0";
        buffer[1] = "x";
        for (uint256 i = 2 * length + 1; i > 1; --i) {
            buffer[i] = _HEX_SYMBOLS[value & 0xf];
            value >>= 4;
        }
        require(value == 0, "Strings: hex length insufficient");
        return string(buffer);
    }

    /**
     * @dev Converts an `address` with fixed length of 20 bytes to its not checksummed ASCII `string` hexadecimal representation.
     */
    function toHexString(address addr) internal pure returns (string memory) {
        return toHexString(uint256(uint160(addr)), _ADDRESS_LENGTH);
    }
}

// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)



/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// OpenZeppelin Contracts (last updated v4.6.0) (token/ERC20/IERC20.sol)



/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

// OpenZeppelin Contracts v4.4.1 (access/IAccessControl.sol)



/**
 * @dev External interface of AccessControl declared to support ERC165 detection.
 */
interface IAccessControl {
    /**
     * @dev Emitted when `newAdminRole` is set as ``role``'s admin role, replacing `previousAdminRole`
     *
     * `DEFAULT_ADMIN_ROLE` is the starting admin for all roles, despite
     * {RoleAdminChanged} not being emitted signaling this.
     *
     * _Available since v3.1._
     */
    event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole);

    /**
     * @dev Emitted when `account` is granted `role`.
     *
     * `sender` is the account that originated the contract call, an admin role
     * bearer except when using {AccessControl-_setupRole}.
     */
    event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Emitted when `account` is revoked `role`.
     *
     * `sender` is the account that originated the contract call:
     *   - if using `revokeRole`, it is the admin role bearer
     *   - if using `renounceRole`, it is the role bearer (i.e. `account`)
     */
    event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender);

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) external view returns (bool);

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {AccessControl-_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) external view returns (bytes32);

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function grantRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     */
    function revokeRole(bytes32 role, address account) external;

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been granted `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     */
    function renounceRole(bytes32 role, address account) external;
}

// OpenZeppelin Contracts (last updated v4.7.0) (access/AccessControl.sol)








/**
 * @dev Contract module that allows children to implement role-based access
 * control mechanisms. This is a lightweight version that doesn't allow enumerating role
 * members except through off-chain means by accessing the contract event logs. Some
 * applications may benefit from on-chain enumerability, for those cases see
 * {AccessControlEnumerable}.
 *
 * Roles are referred to by their `bytes32` identifier. These should be exposed
 * in the external API and be unique. The best way to achieve this is by
 * using `public constant` hash digests:
 *
 * ```
 * bytes32 public constant MY_ROLE = keccak256("MY_ROLE");
 * ```
 *
 * Roles can be used to represent a set of permissions. To restrict access to a
 * function call, use {hasRole}:
 *
 * ```
 * function foo() public {
 *     require(hasRole(MY_ROLE, msg.sender));
 *     ...
 * }
 * ```
 *
 * Roles can be granted and revoked dynamically via the {grantRole} and
 * {revokeRole} functions. Each role has an associated admin role, and only
 * accounts that have a role's admin role can call {grantRole} and {revokeRole}.
 *
 * By default, the admin role for all roles is `DEFAULT_ADMIN_ROLE`, which means
 * that only accounts with this role will be able to grant or revoke other
 * roles. More complex role relationships can be created by using
 * {_setRoleAdmin}.
 *
 * WARNING: The `DEFAULT_ADMIN_ROLE` is also its own admin: it has permission to
 * grant and revoke this role. Extra precautions should be taken to secure
 * accounts that have been granted it.
 */
abstract contract AccessControl is Context, IAccessControl, ERC165 {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private _roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    /**
     * @dev Modifier that checks that an account has a specific role. Reverts
     * with a standardized message including the required role.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     *
     * _Available since v4.1._
     */
    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Returns `true` if `account` has been granted `role`.
     */
    function hasRole(bytes32 role, address account) public view virtual override returns (bool) {
        return _roles[role].members[account];
    }

    /**
     * @dev Revert with a standard message if `_msgSender()` is missing `role`.
     * Overriding this function changes the behavior of the {onlyRole} modifier.
     *
     * Format of the revert message is described in {_checkRole}.
     *
     * _Available since v4.6._
     */
    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, _msgSender());
    }

    /**
     * @dev Revert with a standard message if `account` is missing `role`.
     *
     * The format of the revert reason is given by the following regular expression:
     *
     *  /^AccessControl: account (0x[0-9a-f]{40}) is missing role (0x[0-9a-f]{64})$/
     */
    function _checkRole(bytes32 role, address account) internal view virtual {
        if (!hasRole(role, account)) {
            revert(
                string(
                    abi.encodePacked(
                        "AccessControl: account ",
                        Strings.toHexString(uint160(account), 20),
                        " is missing role ",
                        Strings.toHexString(uint256(role), 32)
                    )
                )
            );
        }
    }

    /**
     * @dev Returns the admin role that controls `role`. See {grantRole} and
     * {revokeRole}.
     *
     * To change a role's admin, use {_setRoleAdmin}.
     */
    function getRoleAdmin(bytes32 role) public view virtual override returns (bytes32) {
        return _roles[role].adminRole;
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleGranted} event.
     */
    function grantRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * If `account` had been granted `role`, emits a {RoleRevoked} event.
     *
     * Requirements:
     *
     * - the caller must have ``role``'s admin role.
     *
     * May emit a {RoleRevoked} event.
     */
    function revokeRole(bytes32 role, address account) public virtual override onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    /**
     * @dev Revokes `role` from the calling account.
     *
     * Roles are often managed via {grantRole} and {revokeRole}: this function's
     * purpose is to provide a mechanism for accounts to lose their privileges
     * if they are compromised (such as when a trusted device is misplaced).
     *
     * If the calling account had been revoked `role`, emits a {RoleRevoked}
     * event.
     *
     * Requirements:
     *
     * - the caller must be `account`.
     *
     * May emit a {RoleRevoked} event.
     */
    function renounceRole(bytes32 role, address account) public virtual override {
        require(account == _msgSender(), "AccessControl: can only renounce roles for self");

        _revokeRole(role, account);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * If `account` had not been already granted `role`, emits a {RoleGranted}
     * event. Note that unlike {grantRole}, this function doesn't perform any
     * checks on the calling account.
     *
     * May emit a {RoleGranted} event.
     *
     * [WARNING]
     * ====
     * This function should only be called from the constructor when setting
     * up the initial roles for the system.
     *
     * Using this function in any other way is effectively circumventing the admin
     * system imposed by {AccessControl}.
     * ====
     *
     * NOTE: This function is deprecated in favor of {_grantRole}.
     */
    function _setupRole(bytes32 role, address account) internal virtual {
        _grantRole(role, account);
    }

    /**
     * @dev Sets `adminRole` as ``role``'s admin role.
     *
     * Emits a {RoleAdminChanged} event.
     */
    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal virtual {
        bytes32 previousAdminRole = getRoleAdmin(role);
        _roles[role].adminRole = adminRole;
        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    /**
     * @dev Grants `role` to `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleGranted} event.
     */
    function _grantRole(bytes32 role, address account) internal virtual {
        if (!hasRole(role, account)) {
            _roles[role].members[account] = true;
            emit RoleGranted(role, account, _msgSender());
        }
    }

    /**
     * @dev Revokes `role` from `account`.
     *
     * Internal function without access restriction.
     *
     * May emit a {RoleRevoked} event.
     */
    function _revokeRole(bytes32 role, address account) internal virtual {
        if (hasRole(role, account)) {
            _roles[role].members[account] = false;
            emit RoleRevoked(role, account, _msgSender());
        }
    }
}



interface ITreasury {
  function deposit(address from, uint256 amount) external;
  function fee() external returns(uint256);
}




interface IMintable {
  function mint(address to_, uint256 amount_) external;

  function burn(uint256 amount_) external;

  function burnFrom(address from_, uint256 amount_) external;
}






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
