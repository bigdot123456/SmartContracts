/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../event/MultiEventsHistoryAdapter.sol";


/// @title ERC20 Manager emitter contract
///
/// Contains all the original event emitting function definitions and events.
/// In case of new events needed later, additional emitters can be developed.
/// All the functions is meant to be called using delegatecall.
contract ERC20ManagerEmitter is MultiEventsHistoryAdapter {
    
    event LogAddToken (
        address indexed self,
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash
    );

    event LogTokenChange (
        address indexed self,
        address oldToken,
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash
    );

    event LogRemoveToken (
        address indexed self,
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash
    );

    event Error(address indexed self, uint errorCode);

    function emitLogAddToken (
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash)
    public
    {
        emit LogAddToken(_self(), token, name, symbol, url, decimals, ipfsHash, swarmHash);
    }

    function emitLogTokenChange (
        address oldToken,
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash)
    public
    {
        emit LogTokenChange(_self(), oldToken, token, name, symbol, url, decimals, ipfsHash, swarmHash);
    }

    function emitLogRemoveToken (
        address token,
        bytes32 name,
        bytes32 symbol,
        bytes32 url,
        uint8 decimals,
        bytes32 ipfsHash,
        bytes32 swarmHash)
    public
    {
        emit LogRemoveToken(_self(), token, name, symbol, url, decimals, ipfsHash, swarmHash);
    }

    function emitError(uint error) public
    {
        emit Error(_self(), error);
    }
}
