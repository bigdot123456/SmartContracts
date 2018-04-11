/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract LOCInterface {
  function getContractOwner() constant returns(address);
  function getIssued() constant returns(uint);
  function getIssueLimit() constant returns(uint);
}
