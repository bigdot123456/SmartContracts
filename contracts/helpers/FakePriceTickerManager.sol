/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../priceticker/PriceTicker.sol";
import "../core/common/BaseManager.sol";

contract FakePriceTickerManager is BaseManager, PriceTicker {

    function FakePriceTickerManager(Storage _store, bytes32 _crate) BaseManager(_store, _crate) {
    }

    function init(address _contractsManager) onlyContractOwner returns (uint) {
        BaseManager.init(_contractsManager, "PriceManager");

        return OK;
    }

    function isPriceAvailable(bytes32 _from, bytes32 _to) public view returns (bool) {
        if ((_from == "FAKE" && _to == "ETH")
            || (_from == "ETH" && _to == "FAKE")) {
                return true;
        }

        return false;
    }

    function price(bytes32 _from, bytes32 _to) public view returns (uint) {
        if (_from == "FAKE" && _to == "ETH") {
            return (10**18);
        }

        if (_from == "ETH" && _to == "FAKE") {
            return (10**18);
        }

        revert();
    }

    function requestPrice(bytes32, bytes32) public payable returns (bytes32, uint) {
        //PriceTickerCallback(msg.sender).receivePrice(keccak256(block.number, now), 10, 1);
    }
}
