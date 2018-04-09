/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract PendingManagerInterface {
    function addTx(bytes32 _hash, bytes _data, address _to, address _sender) public returns (uint);
}
