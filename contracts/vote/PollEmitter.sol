/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/event/MultiEventsHistoryAdapter.sol";


/// @title Emitter with support of events history for PollEntity implementation
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract PollEmitter is MultiEventsHistoryAdapter {

    /** Events */

    event PollVoted(address indexed self, uint8 choice);
    event PollActivated(address indexed self);
    event PollEnded(address indexed self);
    event PollDetailsHashUpdated(address indexed self, bytes32 hash);
    event Error(address indexed self, uint errorCode);


    /** Emitting events */

    function emitError(uint errorCode) public {
        emit Error(_self(), errorCode);
    }

    function emitPollVoted(uint8 choice) public {
        emit PollVoted(_self(), choice);
    }

    function emitPollActivated() public {
        emit PollActivated(_self());
    }

    function emitPollEnded() public {
        emit PollEnded(_self());
    }

    function emitPollDetailsHashUpdated(bytes32 hash) public {
        emit PollDetailsHashUpdated(_self(), hash);
    }
}
