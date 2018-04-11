/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


import "../core/common/Owned.sol";
import "../core/common/OwnedInterface.sol";
import {ChronoBankAssetProxy as AssetProxy} from "../core/platform/ChronoBankAssetProxy.sol";
import {ChronoBankAsset as Asset} from "../core/platform/ChronoBankAsset.sol";
import {ChronoBankAssetWithFee as AssetWithFee} from "../core/platform/ChronoBankAssetWithFee.sol";
//import {ChronoBankAssetWithCallback as AssetWithCallback} from "../core/platform/ChronoBankAssetWithCallback.sol";
//import {ChronoBankAssetWithFeeAndCallback as AssetWithFeeAndCallback} from "../core/platform/ChronoBankAssetWithFeeAndCallback.sol";


contract AssetFactoryInterface {
    function createAsset() public returns (address);
}


contract OwnedAssetFactoryInterface {
    function createOwnedAsset(address owner) public returns (address);
}


/// @title Implementation of token and proxy factory.
/// Creates instances of ChronoBank assets and proxies
contract TokenFactory is Owned {

    /// @dev Mapping (factory type key => address)
    mapping (bytes32 => address) public factories;

    /// @notice Add asset factory with given type to registry
    function setAssetFactory(bytes32 _type, address _factory) onlyContractOwner public returns (bool) {
        require(_type != 0x0);
        factories[_type] = _factory;
    }

    /// @notice Creates ChronoBankAssetProxy contract
    function createProxy() public returns (address) {
        return new AssetProxy();
    }

    /// @notice Creates asset contract
    function createAsset(bytes32 _type) public returns (address) {
        require(factories[_type] != 0x0);
        return AssetFactoryInterface(factories[_type]).createAsset();
    }

    /// @notice Creates owned asset contract
    function createOwnedAsset(bytes32 _type, address _owner) public returns (address) {
        require(factories[_type] != 0x0);
        require(_owner != 0x0);
        return OwnedAssetFactoryInterface(factories[_type]).createOwnedAsset(_owner);
    }
}


/// @title Creates ChronoBankAsset contract
contract ChronoBankAssetFactory is AssetFactoryInterface {

    /// @notice Creates basic asset contract
    function createAsset() public returns (address) {
        return new Asset();
    }
}


/// @title Creates ChronoBankAssetWithFee contract
contract ChronoBankAssetWithFeeFactory is OwnedAssetFactoryInterface {

    /// @notice Creates asset with fee contract
    /// @param _owner of an asset
    function createOwnedAsset(address _owner) public returns (address) {
        AssetWithFee asset = new AssetWithFee();
        asset.transferContractOwnership(_owner);
        return asset;
    }
}


/**
* @dev Creates ChronoBankAssetWithCallback contract
*/
/*contract ChronoBankAssetWithCallbackFactory is OwnedAssetFactoryInterface {
    function createOwnedAsset(address _owner)
    public
    returns (address)
    {
        AssetWithCallback asset = new AssetWithCallback();
        asset.transferContractOwnership(_owner);
        return asset;
    }
}*/

/**
* @dev Creates ChronoBankAssetWithFeeAndCallback contract
*/
/*contract ChronoBankAssetWithFeeAndCallbackFactory is OwnedAssetFactoryInterface {
    function createOwnedAsset(address _owner)
    public
    returns (address)
    {
        AssetWithFeeAndCallback asset = new AssetWithFeeAndCallback();
        asset.transferContractOwnership(_owner);
        return asset;
    }
}*/
