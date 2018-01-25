pragma solidity ^0.4.11;

/**
* @title Declares contract interface to observe changes in TimeHolder.
* @notice version 2
*/
contract HolderListenerInterface {
    function tokenDeposit(address token, address who, uint amount, uint total) public;
    function tokenWithdrawn(address token, address who, uint amount, uint total) public;
}
