/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract ContractsManagerInterface {
    function getContractAddressByType(bytes32 _type) constant returns (address contractAddress);
    function addContract(address _contractAddr, bytes32 _type) returns (uint);
    function removeContract(address _contract) returns (uint);
}
