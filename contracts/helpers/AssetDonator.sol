/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/contracts/ContractsManagerInterface.sol";
import "../core/erc20/ERC20Manager.sol";
import "../core/erc20/ERC20Interface.sol";
import "../core/common/Object.sol";

/**
*  @title AssetDonator
*
*  @notice Created only for test purposes! Do not allow to deploy this contract
*  in production network.
*
*/
contract AssetDonator is Object {
    address contractManager;
    mapping (address => bool) public timeDonations;

    function init(address _contractManager) onlyContractOwner public {
        require(_contractManager != 0x0);
        contractManager = _contractManager;
    }

    /**
    *  @notice Sends 10 TIME to caller.
    *  @notice It is permitted to send TIMEs only once.
    *
    *  @return success or not
    */
    function sendTime() public returns (bool) {
        if (timeDonations[msg.sender]) {
           return false;
        }

        address erc20Manager = ContractsManagerInterface(contractManager)
              .getContractAddressByType("ERC20Manager");
        address token = ERC20Manager(erc20Manager).getTokenAddressBySymbol(bytes32("TIME"));


        if (!ERC20Interface(token).transfer(msg.sender, 1000000000)) {
            return false;
        }

        timeDonations[msg.sender] = true;
        return true;
    }
}
