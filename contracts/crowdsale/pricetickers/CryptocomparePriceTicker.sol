/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../../core/common/Object.sol";
import "../../priceticker/PriceTicker.sol";

/**
*  @title CryptoCompare Price Ticker
*/
contract CryptocomparePriceTicker is PriceTicker, Object {
    uint constant EXCHANGE_RATE_DECIMALS = 18;
    uint constant TTL = 60000;

    struct ExchangePrice {
        uint rate;
        uint expiry;
    }

    struct Query {
        address sender;
        bytes32 hash;
    }

    /* bytes32(from, to) -> price * 10**EXCHANGE_RATE_DECIMALS */
    mapping (bytes32 => ExchangePrice) exchangePrices;
    /* query id -> original sender */
    mapping (bytes32 => Query) queries;

    /**
    *  Only Oraclize access rights checks
    */
    modifier onlyOraclize() {
        _;
    }

    /**
    *  Implement PriceTicker interface.
    */
    function isPriceAvailable(bytes32 _fsym, bytes32 _tsym) constant returns (bool) {
        if (isEquivalentSymbol(_fsym, _tsym)) return true;

        ExchangePrice memory exchangePrice = exchangePrices[sha3(_fsym, _tsym)];
        return exchangePrice.expiry < now;
    }

    /**
    *  Implement PriceTicker interface.
    */
    function price(bytes32 _fsym, bytes32 _tsym) constant returns (uint) {
        if (isEquivalentSymbol(_fsym, _tsym)) return (1 ** 18);

        ExchangePrice memory exchangePrice = exchangePrices[sha3(_fsym, _tsym)];
        return (exchangePrice.rate ** EXCHANGE_RATE_DECIMALS);
    }

    /**
    *  Implement PriceTicker interface.
    */
    function requestPrice(bytes32 _fsym, bytes32 _tsym) payable returns (bytes32, uint) {
        assert(!isEquivalentSymbol(_fsym, _tsym));

        if (_fsym == _tsym) {
            return (0x0, PRICE_TICKER_INVALID_INVOCATION);
        }

        if (isPriceAvailable(_fsym, _tsym)) {
            return (0x0, PRICE_TICKER_INVALID_INVOCATION);
        }

        var (queryId, resultCode) = updatePrice(_fsym, _tsym, msg.sender);
        if (resultCode != OK) {
            return (0x0, resultCode);
        }

        return (queryId, OK);
    }

    /**
    *  Oraclize query callback.
    */
    function __callback(bytes32 _queryId, string _result) onlyOraclize {
        revert();
    }

    /**
    *
    */
    function updatePrice(bytes32 _fsym, bytes32 _tsym, address _sender) internal returns (bytes32, uint) {
        assert(!isEquivalentSymbol(_fsym, _tsym));
        assert(_sender != 0x0);

        return (0x0, PRICE_TICKER_INVALID_INVOCATION);
    }

    function isEquivalentSymbol(bytes32 _fsym, bytes32 _tsym) internal constant returns (bool) {
        if (_fsym == _tsym) return true;
        if (_fsym == "Ether" && _tsym == "ETH") return true;
        if (_fsym == "ETH" && _tsym == "Ether") return true;

        return false;
    }
}
