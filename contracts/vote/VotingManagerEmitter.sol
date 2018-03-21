pragma solidity ^0.4.11;

import '../core/event/MultiEventsHistoryAdapter.sol';


/// @title Emitter with support of events history for VotingManager
contract VotingManagerEmitter is MultiEventsHistoryAdapter {

    /** Events */

    event PollCreated(address indexed self, address indexed pollAddress, uint optionsCount, bytes32 detailsIpfsHash, uint votelimit, uint deadline);

    event PollRemoved(address indexed self, address indexed pollAddress);

    event VotingSharesPercentUpdated(address indexed self, uint percent);

    event Error(address indexed self, uint errorCode);


    /** Emitters */

    function emitPollCreated(address _pollAddress, uint _optionsCount, bytes32 _detailsIpfsHash, uint _votelimit, uint _deadline) public {
        PollCreated(_self(), _pollAddress, _optionsCount, _detailsIpfsHash, _votelimit, _deadline);
    }

    function emitPollRemoved(address pollAddress) public {
        PollRemoved(_self(), pollAddress);
    }

    function emitVotingSharesPercentUpdated(uint _percent) public {
        VotingSharesPercentUpdated(_self(), _percent);
    }

    function emitError(uint errorCode) public {
        Error(_self(), errorCode);
    }
}
