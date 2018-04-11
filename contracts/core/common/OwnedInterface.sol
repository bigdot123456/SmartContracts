/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract OwnedInterface {
   function claimContractOwnership() returns(bool);
   function changeContractOwnership(address _to) returns(bool);
   function transferContractOwnership(address _to) public returns (bool);
}
