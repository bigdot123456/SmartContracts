/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract Clock {
    function time() public view returns (uint) {
        return now;
    }
}
