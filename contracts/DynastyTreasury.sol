// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "node_modules/@openzeppelin/contracts/security/Pausable.sol";
import "node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import './interfaces/ITreasury.sol';

contract DynastyTreasury is ITreasury, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // mapping(uint256 => uint256) internal _percentages;
    // address[] internal _receivers;    
    uint256 internal _fee;
    // bytes32 public constant VOTER_ROLE = keccak256("VOTER_ROLE");
    /** 
     * Token interface of the token used for entering games 
     */
    IERC20 _inputToken;

    // uint256 internal _requiredVotes;
    // mapping(address => mapping(address => uint256)) internal _votes;
    event TreasuryFeeChange(uint256 fee);
    event InputTokenChange(address erc20Token);

    constructor() {
      _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
      _grantRole(PAUSER_ROLE, msg.sender);
      _grantRole(MANAGER_ROLE, msg.sender);
      // _grantRole(VOTER_ROLE, msg.sender);
    }

    // function _beforeVotedAction(address subject, address voter) internal view {
    //   require(subject != voter, 'invalid vote');
    //   require(_votes[subject][voter] >= _requiredVotes, 'there are less votes then needed');
    // }

    // function _afterVotedAction(address subject, address voter) internal {
    //   _votes[subject][voter] = false;
    // }

    // function addVoter(address voter) public onlyRole(MANAGER_ROLE) {

    // }


    function setInputToken(address address_) public onlyRole(MANAGER_ROLE) {
      _inputToken = IERC20(address_);
      emit InputTokenChange(address_);
    }

    // function vote(address subject, bool vote_) public onlyRole(VOTER_ROLE) {
    //   _votes[subject][msg.sender] = vote_;
    // }

    function emergencyWithdraw(address payable to, address tokenAddress, uint256 amount) public payable onlyRole(MANAGER_ROLE) {
      // _beforeVotedAction(address(this));

      if (tokenAddress == address(0)) {
        (bool success,) = to.call{value: amount}('');
        require(success, "Transfer Failed");
      } else {
        // todo full balance or not?
        // uint256 amount = IERC20(tokenAddress).balanceOf(address(this))
        // IERC20(tokenAddress).allowance(address(this), to);
        IERC20(tokenAddress).transferFrom(address(this), to, amount);
      }

      // _afterVotedAction(address(this));

    }

    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function getBalance() public view returns (uint256) {
      return address(this).balance;
    }

    function getBalanceERC20(address tokenAddress) public view returns (uint256) {      
      return IERC20(tokenAddress).balanceOf(address(this));
    }

    function deposit(address from, uint256 amount) public {
      // _inputToken.allowance(from, address(this));      
      _inputToken.transferFrom(from, address(this), amount); // usdc has 8 decimals our credit token 0

      // todo EnumerableMap
      // for (uint256 i = 0; i < _receivers.length; i++) {
      //   _inputToken.transferFrom(address(this), _receivers[i], amount / 100 * _percentages[i]);
      // }
    }   

    function setTreasuryFee(uint256 fee_) public onlyRole(MANAGER_ROLE) {
      _fee = fee_;
      emit TreasuryFeeChange(_fee);
    }

    function fee() public view returns(uint256) {
      return _fee;
    }
    
    // function withdraw(address from, uint256 amount) public {
    //   _inputToken.allowance(from, address(this));      
    //   _inputToken.transferFrom(from, address(this), amount); // usdc has 8 decimals our credit token 0

    //   // todo EnumerableMap
    //   // for (uint256 i = 0; i < _receivers.length; i++) {
    //   //   _inputToken.transferFrom(address(this), _receivers[i], amount / 100 * _percentages[i]);
    //   // }
    // }
}
