/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/event/MultiEventsHistoryAdapter.sol";


/// @title PendingManagerEmitter
contract PendingManagerEmitter is MultiEventsHistoryAdapter {
    
    event AddMultisigTx(address indexed self, address indexed owner, address sender, bytes32 indexed hash);
    event Confirmation(address indexed self, address indexed owner, bytes32 indexed hash);
    event Revoke(address indexed self, address indexed owner, bytes32 indexed hash);
    event Cancelled(address indexed self, bytes32 indexed hash);
    event Done(address indexed self, bytes32 indexed hash, bytes data, uint timestamp);
    event Error(address indexed self, uint errorCode);

    function emitTxAdded(address _owner, address _sender, bytes32 _hash) public {
        emit AddMultisigTx(_self(), _owner, _sender, _hash);
    }

    function emitConfirmation(address _owner, bytes32 _hash) public {
        emit Confirmation(_self(), _owner, _hash);
    }

    function emitRevoke(address _owner, bytes32 _hash) public {
        emit Revoke(_self(), _owner, _hash);
    }

    function emitCancelled(bytes32 _hash) public {
        emit Cancelled(_self(), _hash);
    }

    function emitDone(bytes32 _hash, bytes _data, uint _timestamp) public {
        emit Done(_self(), _hash, _data, _timestamp);
    }

    function emitError(uint _errorCode) public {
        emit Error(_self(), _errorCode);
    }
}
