/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "./ReissuableWalletInterface.sol";
import "../core/common/Managed.sol";
import "../core/erc20/ERC20Interface.sol";
import "../core/platform/ChronoBankPlatformInterface.sol";
import "../assets/AssetsManagerInterface.sol";
import "../assets/TokenManagementInterface.sol";
import "../assets/ChronoBankWalletFallbackSupporter.sol";


/**
* @title LOCManager's wallet contract defines a basic implementation of DepositWalletInterface
* to provide a way to store/deposit/withdraw tokens on this contract according to access rights.
* Here deposit/withdraw are allowed only by LOCManager contract.
*
* @dev Specifies a contract that helps in updating LOCManager interface by delegating token's ownership
* to LOCManagerWallet contract
*/
contract LOCWallet is ReissuableWalletInterface, ChronoBankWalletFallbackSupporter {

    /**
    * Restricts calls only for LOCManager contract
    */
    modifier onlyLOCManager() {
        if (msg.sender != lookupManager("LOCManager")) {
            revert();
        }
        _;
    }

    function LOCWallet(Storage _store, bytes32 _crate) ChronoBankWalletFallbackSupporter(_store, _crate) {
    }

    /**
    * Initializes contract with its ready-to-use state
    *
    * @param _contractsManager contracts manager address
    *
    * @return `true` if all went okay, `false` otherwise
    */
    function init(address _contractsManager) onlyContractOwner returns (bool) {
        contractsManager = _contractsManager;
        return true;
    }

    /**
    * Allows contract owner to destroy a contract and withdraw all tokens associated
    * with this address to a message sender
    * @dev Allowed only for contract owner
    *
    * @param tokens an array of ERC20-compatible assets
    *
    * @return result code of an operation
    */
    function destroy(address[] tokens) onlyContractOwner returns (uint) {
        withdrawnTokens(tokens, msg.sender);
        selfdestruct(msg.sender);
        return OK;
    }

    /**
    * Forbidden to invoke this implementation of destroy method. See another one which takes tokens' addresses
    * @dev Reverts all actions when this method was invoked
    */
    function destroy() onlyContractOwner {
        revert();
    }

    /**
    * Performs reissuing of an asset in provided platform for a specified amount.
    * @dev Allowed only for LOCManager
    *
    * @param _platform platform address
    * @param _symbol asset that is registered in a platform and needed to be reissued
    * @param _amount a number of tokens to reissue
    *
    * @return result code of an operation
    */
    function reissue(address _platform, bytes32 _symbol, uint256 _amount) onlyLOCManager public returns (uint) {
        address _assetsManager = lookupManager("AssetsManager");
        address _tokenExtension = AssetsManagerInterface(_assetsManager).getTokenExtension(_platform);
        if (_tokenExtension == 0x0) {
            return ChronoBankPlatformInterface(_platform).reissueAsset(_symbol, _amount);
        }

        return TokenManagementInterface(_tokenExtension).getReissueAssetProxy().reissueAsset(_symbol, _amount);
    }

    /**
    * Performs revokation of an asset in provided platform for a specified amount.
    * @dev Allowed only for LOCManager
    *
    * @param _platform platform address
    * @param _symbol asset that is registered in a platform and needed to be revoked
    * @param _amount a number of tokens to revoke
    *
    * @return result code of an operation
    */
    function revoke(address _platform, bytes32 _symbol, uint256 _amount) onlyLOCManager public returns (uint) {
        address _assetsManager = lookupManager("AssetsManager");
        address _tokenExtension = AssetsManagerInterface(_assetsManager).getTokenExtension(_platform);
        if (_tokenExtension == 0x0) {
            return ChronoBankPlatformInterface(_platform).revokeAsset(_symbol, _amount);
        }

        return TokenManagementInterface(_tokenExtension).getRevokeAssetProxy().revokeAsset(_symbol, _amount);
    }

    /**
    * Deposits some amount of tokens on wallet's account using ERC20 tokens
    *
    * @dev Allowed only for locManager
    *
    * @param _asset an address of token
    * @param _from an address of a sender who is willing to transfer her resources
    * @param _amount an amount of tokens (resources) a sender wants to transfer
    *
    * @return `true` if all successfuly completed, `false` otherwise
    */
    function deposit(address _asset, address _from, uint256 _amount) onlyLOCManager public returns (bool) {
        return ERC20Interface(_asset).transferFrom(_from, this, _amount);
    }

    /**
    * Withdraws some amount of tokens from wallet's account using ERC20 tokens
    *
    * @dev Allowed only for locManager
    *
    * @param _asset an address of token
    * @param _to an address of a receiver who is willing to get stored resources
    * @param _amount an amount of tokens (resources) a receiver wants to get
    *
    * @return `true` if all successfuly completed, `false` otherwise
    */
    function withdraw(address _asset, address _to, uint256 _amount) onlyLOCManager public returns (bool) {
        return ERC20Interface(_asset).transfer(_to, _amount);
    }
}
