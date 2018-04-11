/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/event/MultiEventsHistoryAdapter.sol";


/// @title Emitter with support of events history for VotingManager
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract VotingManagerEmitter is MultiEventsHistoryAdapter {

    /* Events */

    event PollCreated(
        address indexed self, 
        address indexed pollAddress, 
        uint optionsCount, 
        bytes32 detailsIpfsHash, 
        uint votelimit, 
        uint deadline
    );
    event PollRemoved(address indexed self, address indexed pollAddress);
    event VotingSharesPercentUpdated(address indexed self, uint percent);
    event Error(address indexed self, uint errorCode);


    /* Emitting events */

    function emitPollCreated(
        address _pollAddress, 
        uint _optionsCount, 
        bytes32 _detailsIpfsHash, 
        uint _votelimit, 
        uint _deadline
    ) 
    public 
    {
        emit PollCreated(_self(), _pollAddress, _optionsCount, _detailsIpfsHash, _votelimit, _deadline);
    }

    function emitPollRemoved(address pollAddress) public {
        emit PollRemoved(_self(), pollAddress);
    }

    function emitVotingSharesPercentUpdated(uint _percent) public {
        emit VotingSharesPercentUpdated(_self(), _percent);
    }

    function emitError(uint errorCode) public {
        emit Error(_self(), errorCode);
    }
}
