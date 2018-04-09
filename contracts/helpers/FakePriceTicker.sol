/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../priceticker/PriceTicker.sol";

contract FakePriceTicker is PriceTicker {

    function isPriceAvailable(bytes32, bytes32) public view returns (bool) {
        return true;
    }

    function price(bytes32, bytes32) public view returns (uint) {
        return (10**18);
    }

    function requestPrice(bytes32, bytes32) public payable returns (bytes32, uint) {
        //PriceTickerCallback(msg.sender).receivePrice(keccak256(block.number, now), 10, 1);
    }
}
