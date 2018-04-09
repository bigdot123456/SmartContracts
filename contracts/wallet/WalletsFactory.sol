/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "./Wallet.sol";

contract WalletsFactory {
    function createWallet(
        address[] _owners,
        uint _required,
        address _contractsManager,
        bool _use2FA,
        uint _releaseTime)
    public returns(address) {
        return new Wallet(_owners, _required, _contractsManager, _use2FA, _releaseTime);
    }
}
