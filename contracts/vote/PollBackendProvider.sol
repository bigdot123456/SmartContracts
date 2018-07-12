/**
* Copyright 2017–2018, LaborX PTY
* Licensed under the AGPL Version 3 license.
*/

pragma solidity ^0.4.21;


import "../core/common/Object.sol";


/// @title Organizes centralized access to poll backend and allows to easily update
/// poll backend without a need to remember all places where it was used
contract PollBackendProvider is Object {

    /// @dev Poll backend address
    address private pollBackend;

    /// @notice Gets address of actual poll backend contract
    function getPollBackend() 
    public 
    view 
    returns (address) 
    {
        return pollBackend;
    }

    /// @notice Sets provided poll backend contract as actual
    function setPollBackend(address _pollBackend)
    external
    onlyContractOwner
    returns (uint)
    {
        require(_pollBackend != 0x0);

        pollBackend = _pollBackend;
        return OK;
    }
}