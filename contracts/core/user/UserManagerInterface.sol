/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract UserManagerInterface {

    function getCBE(address _member) constant returns (bool);
    function getMemberId(address sender) constant returns (uint);
    function required() constant returns(uint);

}


