/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../../core/event/MultiEventsHistoryAdapter.sol";


/// @title Emitter with support of events history for TokenExtensionRouter
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract PlatformTokenExtensionGatewayManagerEmitter is MultiEventsHistoryAdapter {

    /// @dev Event for errors
    event Error(address indexed self, uint errorCode);

    /// @dev Event for creating an asset
    event AssetCreated(address indexed self, address platform, bytes32 symbol, address token, address indexed by);

    /// @dev Event for starting token's crowdsale
    event CrowdsaleCampaignCreated(address indexed self, address platform, bytes32 symbol, address campaign, address indexed by);

    /// @dev Event for removing token's crowdsale
    event CrowdsaleCampaignRemoved(address indexed self, address platform, bytes32 symbol, address campaign, address indexed by);

    function emitError(uint _errorCode) public {
        emit Error(_self(), _errorCode);
    }

    function emitAssetCreated(address _platform, bytes32 _symbol, address _token, address _by) public {
        emit AssetCreated(_self(), _platform, _symbol, _token, _by);
    }

    function emitCrowdsaleCampaignCreated(address _platform, bytes32 _symbol, address _campaign, address _by) public {
        emit CrowdsaleCampaignCreated(_self(), _platform, _symbol, _campaign, _by);
    }

    function emitCrowdsaleCampaignRemoved(address _platform, bytes32 _symbol, address _campaign, address _by) public {
        emit CrowdsaleCampaignRemoved(_self(), _platform, _symbol, _campaign, _by);
    }
}
