/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../base/ChronoMintCrowdsale.sol";

/**
 * @title TimeLimitedCrowdsale is a crowdsale contract.
 *
 * Crowdsales have a start and end time,
 * where investors can make token purchases and
 * the crowdsale will assign them tokens based on a token per exchange rate.
 *
 * See ChronoMintCrowdsale.
 */
contract TimeLimitedCrowdsale is ChronoMintCrowdsale {
    /* Time limited crowdfunding configuration */
    struct Params {
        uint startTime;
        uint endTime;
    }

    Params public config;

    function TimeLimitedCrowdsale(address _serviceProvider, bytes32 _symbol, address _priceTicker)
            ChronoMintCrowdsale(_serviceProvider, _symbol, _priceTicker)
    {
    }

    function init(
        bytes32 _currencyCode,
        uint _minValue,
        uint _maxValue,
        uint _exchangeRate,
        uint _exchangeRateDecimals,
        uint _startTime,
        uint _endTime
    ) onlyAuthorised onlyOnce {
        require(_endTime > _startTime);
        require(now < _endTime);

        init(_currencyCode, _minValue, _maxValue, _exchangeRate, _exchangeRateDecimals);

        config.startTime = _startTime;
        config.endTime = _endTime;
    }

    function isRunning() constant returns (bool) {
        return now > config.startTime
                && now < config.endTime
                && GenericCrowdsale.isRunning();
    }

    function isFailed() constant returns (bool) {
        return now > config.endTime
                && !GenericCrowdsale.isSuccessed();
    }
}
