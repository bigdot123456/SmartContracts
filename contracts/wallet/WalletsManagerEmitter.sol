/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import '../core/event/MultiEventsHistoryAdapter.sol';

contract WalletsManagerEmitter is MultiEventsHistoryAdapter {
    event Error(address indexed self, uint errorCode);    
    event WalletCreated(address indexed self, address wallet, address indexed by);
    event WalletDeleted(address indexed self, address wallet);

    function emitError(uint errorCode) public {
        Error(_self(), errorCode);
    }

    function emitWalletCreated(address wallet, address by) public {
        WalletCreated(_self(), wallet, by);
    }

    function emitWalletDeleted(address wallet) public {
        WalletDeleted(_self(), wallet);
    }
}
