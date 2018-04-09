/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract Once {
    mapping (bytes4 => bool) methods;

    modifier onlyOnce() {
        if (!methods[msg.sig]) {
            _;
            methods[msg.sig] = true;
        }
    }
}
