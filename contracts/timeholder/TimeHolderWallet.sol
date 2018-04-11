/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/common/Managed.sol";
import "./DepositWalletInterface.sol";
import "../core/erc20/ERC20Interface.sol";
/**
* @title TimeHolder's wallet contract defines a basic implementation of DepositWalletInterface
* to provide a way to store/deposit/withdraw tokens on this contract according to access rights.
* Here deposit/withdraw are allowed only by TimeHolder contract.
*
* @dev Specifies a contract that helps in updating TimeHolder interface by delegating token's ownership
* to TimeHolderWallet contract
*/
contract TimeHolderWallet is Managed, DepositWalletInterface {
    modifier onlyTimeHolder() {
        if (msg.sender == lookupManager("TimeHolder")) {
            _;
        }
    }

    function TimeHolderWallet(Storage _store, bytes32 _crate) Managed(_store, _crate) {
    }

    function init(address _contractsManager) onlyContractOwner returns (bool) {
        contractsManager = _contractsManager;
        return true;
    }

    /**
    * Call `selfdestruct` when contract is not needed anymore. Also takes a list of tokens
    * that can be associated and have an account for this contract
    *
    * @dev Allowed only for contract owner
    *
    * @param tokens an array of tokens addresses
    *
    * @return result code of an operation
    */
    function destroy(address[] tokens) onlyContractOwner returns (uint) {
        withdrawnTokens(tokens, msg.sender);
        selfdestruct(msg.sender);
        return OK;
    }

    /**
    * Deposits some amount of tokens on wallet's account using ERC20 tokens
    *
    * @dev Allowed only for timeHolder
    *
    * @param _asset an address of token
    * @param _from an address of a sender who is willing to transfer her resources
    * @param _amount an amount of tokens (resources) a sender wants to transfer
    *
    * @return `true` if all successfuly completed, `false` otherwise
    */
    function deposit(address _asset, address _from, uint256 _amount) onlyTimeHolder returns (bool) {
        return ERC20Interface(_asset).transferFrom(_from, this, _amount);
    }

    /**
    * Withdraws some amount of tokens from wallet's account using ERC20 tokens
    *
    * @dev Allowed only for timeHolder
    *
    * @param _asset an address of token
    * @param _to an address of a receiver who is willing to get stored resources
    * @param _amount an amount of tokens (resources) a receiver wants to get
    *
    * @return `true` if all successfuly completed, `false` otherwise
    */
    function withdraw(address _asset, address _to, uint256 _amount) onlyTimeHolder returns (bool) {
        return ERC20Interface(_asset).transfer(_to, _amount);
    }
}
