/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.21;


/// @title Provides an interface that allows to reissue asset with symbol with some amount
contract ReissuableAssetProxyInterface {
    function reissueAsset(bytes32 _symbol, uint _value) public returns (uint errorCode);
}


/// @title Provides an interface that allows to revoke asset with symbol with some amount
contract RevokableAssetProxyInterface {
    function revokeAsset(bytes32 _symbol, uint _value) public returns (uint errorCode);
}


/// @title Provides an interface that allows to create fully functional token with different options
/// (with or without fee)
contract TokenManagementInterface {
    function platform() public view returns (address);

    function createAssetWithoutFee(
        bytes32 _symbol, 
        string _name, 
        string _description, 
        uint _value, 
        uint8 _decimals, 
        bool _isMint, 
        bytes32 _tokenImageIpfsHash
        ) 
    public 
    returns (uint);

    function createAssetWithFee(
        bytes32 _symbol, 
        string _name, 
        string _description, 
        uint _value, 
        uint8 _decimals, 
        bool _isMint, 
        address _feeAddress, 
        uint32 _feePercent, 
        bytes32 _tokenImageIpfsHash
        ) 
    public 
    returns (uint);

    function getAssetOwnershipManager() public view returns (address);
    function getReissueAssetProxy() public view returns (ReissuableAssetProxyInterface);
    function getRevokeAssetProxy() public view returns (RevokableAssetProxyInterface);
}
