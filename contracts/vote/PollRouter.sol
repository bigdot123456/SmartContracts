/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/common/BaseByzantiumRouter.sol";
import "../core/contracts/ContractsManagerInterface.sol";
import "../core/common/Owned.sol";
import "./PollEmitter.sol";
import "./PollBackendProvider.sol";


/// @title Defines a shell that will redirects almost all actions to a backend address.
/// This contract provides storage layout of variables that will be accessed during delegatecall.
/// Partially implements PollInterface interface.
contract PollRouter is BaseByzantiumRouter, PollEmitter {

    /**
    * Storage variables. DO NOT CHANGE VARIABLES' LAYOUT UNDER ANY CIRCUMSTANCES!
    */

    address internal contractOwner;
    address internal pendingContractOwner;

    address internal backendProviderAddress;
    address internal contractsManager;


    /** PUBLIC section */

    function PollRouter(address _contractsManager, address _backendProviderAddress) public {
        require(_backendProviderAddress != 0x0);
        require(_contractsManager != 0x0);

        contractOwner = msg.sender;
        contractsManager = _contractsManager;
        backendProviderAddress = _backendProviderAddress;
    }

    /// @notice Gets address of a backend contract
    /// @return _backend address of a backend contract
    function backend() internal view returns (address) {
        return PollBackendProvider(backendProviderAddress).getPollBackend();
    }
}
