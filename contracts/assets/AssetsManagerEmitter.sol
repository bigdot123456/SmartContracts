/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/event/MultiEventsHistoryAdapter.sol";


/// @title Emitter with support of events history for AssetsManager
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract AssetsManagerEmitter is MultiEventsHistoryAdapter {

    /// @dev error event
    event Error(address indexed self, uint errorCode);

    /// @dev event for requesting token extension
    event TokenExtensionRequested(address indexed self, address platform, address tokenExtension);

    /// @dev event for registering token extension
    event TokenExtensionRegistered(address indexed self, address platform, address tokenExtension);

    /// @dev event for unregistering token extension
    event TokenExtensionUnregistered(address indexed self, address tokenExtension);

    /** Emitting events */

    function emitError(uint errorCode) public {
        emit Error(_self(), errorCode);
    }

    function emitTokenExtensionRequested(address _platform, address _tokenExtension) public {
        emit TokenExtensionRequested(_self(), _platform, _tokenExtension);
    }

    function emitTokenExtensionRegistered(address _platform, address _tokenExtension) public {
        emit TokenExtensionRegistered(_self(), _platform, _tokenExtension);
    }

    function emitTokenExtensionUnregistered(address _tokenExtension) public {
        emit TokenExtensionUnregistered(_self(), _tokenExtension);
    }
}
