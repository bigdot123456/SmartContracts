/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/event/MultiEventsHistoryAdapter.sol";


/// @title Emitter with support of events history for PlatformsManager
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract PlatformsManagerEmitter is MultiEventsHistoryAdapter {

    /// @dev Event for attaching a platform to the system
    event PlatformAttached(address indexed self, address platform, address indexed by);

    /// @dev Event for detaching a platform from the system
    event PlatformDetached(address indexed self, address platform, address indexed by);

    /// @dev Event for creating a platform
    event PlatformRequested(address indexed self, address platform, address tokenExtension, address indexed by);

    /// @dev Event for errors
    event Error(address indexed self, uint errorCode);


    /* Emitting events */

    function emitPlatformAttached(address _platform, address _by) public {
        emit PlatformAttached(_self(), _platform, _by);
    }

    function emitPlatformDetached( address _platform, address _by) public {
        emit PlatformDetached(_self(), _platform, _by);
    }

    function emitPlatformRequested( address _platform, address _tokenExtension, address _by) public {
        emit PlatformRequested(_self(), _platform, _tokenExtension, _by);
    }

    function emitError(uint _errorCode) public {
        emit Error(_self(), _errorCode);
    }
}
