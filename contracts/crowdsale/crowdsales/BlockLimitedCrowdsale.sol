/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../base/ChronoMintCrowdsale.sol";

/**
 * @title BlockLimitedCrowdsale is a crowdsale contract.
 *
 * Crowdsales have a start and end block numbers,
 * where investors can make token purchases and
 * the crowdsale will assign them tokens based on a token per exchange rate.
 *
 * See ChronoMintCrowdsale.
 */
contract BlockLimitedCrowdsale is ChronoMintCrowdsale {
    /* Block limited crowdfunding configuration */
    struct Params {
        uint256 startBlock;
        uint256 stopBlock;
    }

    Params public config;

    function BlockLimitedCrowdsale(address _serviceProvider, bytes32 _symbol, address _priceTicker)
              ChronoMintCrowdsale(_serviceProvider, _symbol, _priceTicker)
    {
    }

    function init(
        bytes32 _currencyCode,
        uint _minValue,
        uint _maxValue,
        uint _exchangeRate,
        uint _exchangeRateDecimals,
        uint256 _startBlock,
        uint256 _stopBlock
    ) onlyAuthorised onlyOnce {
        require (_stopBlock > _startBlock);
        require (block.number < _stopBlock);

        init(_currencyCode, _minValue, _maxValue, _exchangeRate, _exchangeRateDecimals);

        config.startBlock = _startBlock;
        config.stopBlock = _stopBlock;
    }

    function isRunning() constant returns (bool) {
        return block.number > config.startBlock
                  && block.number < config.stopBlock
                  && GenericCrowdsale.isRunning();
    }

    function isFailed() constant returns (bool) {
        return block.number > config.stopBlock
                && !GenericCrowdsale.isSuccessed();
    }
}
