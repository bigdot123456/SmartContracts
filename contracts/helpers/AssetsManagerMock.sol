/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/contracts/ContractsManagerInterface.sol";
import "../assets/AssetsManagerInterface.sol";

contract AssetsManagerMock is AssetsManagerInterface {
    uint constant OK = 1;

    address contractsManager;
    bytes32[] symbols;
    mapping(bytes32 => address) assets;

    function init(address _contractsManager) public returns (bool) {
        if(contractsManager != 0x0) {
            return false;
        }

        uint errorCode = ContractsManagerInterface(_contractsManager).addContract(this, "AssetsManager");
        if (OK != errorCode) {
            return false;
        }

        contractsManager = _contractsManager;
        return true;
    }


    function isAssetSymbolExists(bytes32 _symbol) public view returns (bool) {
        return assets[_symbol] != 0x0;
    }

    function getAssetsSymbols() public view returns (bytes32[]) {
        return symbols;
    }

    function getAssetsSymbolsCount() public view returns (uint) {
        return symbols.length;
    }

    function getAssetBySymbol(bytes32 symbol) public view returns (address) {
        return assets[symbol];
    }
    
    function addAsset(address asset, bytes32 _symbol, address) public returns (bool) {
        if (assets[_symbol] == 0x0) {
            symbols.push(_symbol);
            assets[_symbol] = asset;
            return true;
        }
        return false;
    }

    function getAssetsForOwner(address, address) public view returns (bytes32[]) {
        return symbols;
    }

    function getAssetsForOwnerCount(address, address) public view returns (uint) {
        return symbols.length;
    }

    function getAssetForOwnerAtIndex(address, address, uint _index) public view returns (bytes32) {
        return symbols[_index];
    }

    function isAssetOwner(bytes32, address) public view returns (bool) {
        return true;
    }

    function getTokenExtension(address) public view returns (address) {
        revert();
    }

    function requestTokenExtension(address) public returns (uint) {
        revert();
    }

    function() public {
        revert();
    }
}
