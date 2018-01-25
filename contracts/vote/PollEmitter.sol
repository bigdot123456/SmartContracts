pragma solidity ^0.4.11;

import '../core/event/MultiEventsHistoryAdapter.sol';

/// @title Emitter with support of events history for PollEntity implementation
contract PollEmitter is MultiEventsHistoryAdapter {

    /** Events */

    event PollVoted(address indexed self, uint8 choice);

    event PollActivated(address indexed self);

    event PollEnded(address indexed self);

    event Error(address indexed self, uint errorCode);


    /** Emitters */

    function emitError(uint errorCode) public {
        Error(_self(), errorCode);
    }

    function emitPollVoted(uint8 choice) public {
        PollVoted(_self(), choice);
    }

    function emitPollActivated() public {
        PollActivated(_self());
    }

    function emitPollEnded() public {
        PollEnded(_self());
    }
}
