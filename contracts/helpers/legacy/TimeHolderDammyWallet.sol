/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../../core/erc20/ERC20Interface.sol";
/**
* @title TimeHolder's wallet contract defines a basic implementation of DepositWalletInterface
* to provide a way to store/deposit/withdraw tokens on this contract according to access rights.
* Here deposit/withdraw are allowed only by TimeHolder contract.
*
* @dev Specifies a contract that helps in updating TimeHolder interface by delegating token's ownership
* to TimeHolderWallet contract
*/
contract TimeHolderDammyWallet {
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
    function deposit(address _asset, address _from, uint256 _amount) returns (bool) {
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
    function withdraw(address _asset, address _to, uint256 _amount) returns (bool) {
        return ERC20Interface(_asset).transfer(_to, _amount);
    }
}
