/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

contract TokenExtensionFallbackInterface {
    function fallbackAsset(bytes32 _symbol) returns (bool);
    function fallbackAssetInvoke(bytes32 _symbol, address _from, bytes _data) returns (bool);
    function fallbackAssetPassOwnership(bytes32 _symbol, address _to) returns (bool);
}
