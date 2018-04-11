/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/event/MultiEventsHistoryAdapter.sol";

contract CrowdsaleManagerEmitter is MultiEventsHistoryAdapter {
    event CrowdsaleCreated(address indexed self, address indexed creator, bytes32 symbol, address crowdsale);
    event CrowdsaleDeleted(address indexed self, address crowdsale);
    event Error(address indexed self, uint errorCode);

    function emitCrowdsaleCreated(address creator, bytes32 symbol, address crowdsale) {
        CrowdsaleCreated(_self(), creator, symbol, crowdsale);
    }

    function emitCrowdsaleDeleted(address crowdsale) {
        CrowdsaleDeleted(_self(), crowdsale);
    }

    function emitError(uint errorCode) {
        Error(_self(), errorCode);
    }
}
