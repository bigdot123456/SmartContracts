/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import '../core/event/MultiEventsHistoryAdapter.sol';

contract ExchangeManagerEmitter is MultiEventsHistoryAdapter {
    event ExchangeCreated(
        address indexed self,
        address indexed user,
        address exchange,
        bytes32 symbol);
    event ExchangeAdded(address indexed self, address indexed user, address exchange, bytes32 symbol);
    event ExchangeRemoved(address indexed self, address exchange, bytes32 symbol);
    event Error(address indexed self, uint errorCode);

    function emitExchangeCreated(
        address user,
        address exchange,
        bytes32 symbol)
    public
    {
        ExchangeCreated(_self(), user, exchange, symbol);
    }

    function emitExchangeRemoved(address exchange, bytes32 symbol) public {
        ExchangeRemoved(_self(), exchange, symbol);
    }

    function emitExchangeAdded(address user, address exchange, bytes32 symbol) public {
        ExchangeAdded(_self(), user, exchange, symbol);
    }

    function emitError(uint errorCode) public {
        Error(_self(), errorCode);
    }
}
