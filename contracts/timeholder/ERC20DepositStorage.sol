/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

pragma solidity ^0.4.11;

import "../core/common/Managed.sol";
import "../core/lib/SafeMath.sol";


/// @title ERC20 Deposit storage.
///
/// Contract intends to keep track deposits records.
/// Supports old and new versions of Deposits and utilized by TimeHolder
/// to resolve deposit versions.
contract ERC20DepositStorage is Managed {

    using SafeMath for uint;

    /** Storage keys */

    StorageInterface.OrderedAddressesSet shareholders;
    StorageInterface.UIntOrderedSetMapping deposits;
    StorageInterface.UInt depositsIdCounter;
    StorageInterface.AddressUIntUIntMapping amounts;
    StorageInterface.AddressUIntUIntMapping timestamps;
    StorageInterface.UInt totalSharesStorage;
    StorageInterface.Address sharesContractStorage;

    StorageInterface.AddressOrderedSetMapping shareholders_v2;
    StorageInterface.Bytes32UIntMapping depositsIdCounters_v2;
    StorageInterface.Mapping amounts_v2; // mapping(bytes32(key)=>mapping(bytes32(idx)=>uint(amount))) // to TimeHolder
    StorageInterface.Mapping timestamps_v2; // mapping(bytes32(key)=>mapping(bytes32(idx)=>uint(time))) // to TimeHolder
    StorageInterface.AddressUIntMapping totalSharesStorage_v2;
    StorageInterface.AddressesSet sharesTokenStorage_v2;
    StorageInterface.AddressUIntMapping limitsStorage_v2;

    /// @dev Restricts access to functions only for TimeHolder sender
    modifier onlyTimeHolder {
        require(store.store.manager().isAllowed(msg.sender, store.crate));
        _;
    }

    /// @notice Constructor
    function ERC20DepositStorage(Storage _store, bytes32 _crate) Managed(_store, _crate) {
        shareholders.init('shareholders');
        deposits.init('deposits');
        depositsIdCounter.init('depositsIdCounter');
        amounts.init('amounts');
        timestamps.init('timestamps');
        totalSharesStorage.init('totalSharesStorage');
        sharesContractStorage.init('sharesContractStorage');

        shareholders_v2.init("shareholders_v2");
        depositsIdCounters_v2.init("depositsIdCounters_v2");
        amounts_v2.init("amounts");
        timestamps_v2.init("timestamps");
        totalSharesStorage_v2.init("totalSharesStorage_v2");
        sharesTokenStorage_v2.init("sharesContractsStorage_v2");
        limitsStorage_v2.init("limitAmountsStorage_v2");
    }

    /// @notice Init DepositStorage contract.
    function init(address _contractsManager) onlyContractOwner public returns (uint) {
        contractsManager = _contractsManager;
    }

    /// @notice Sets shares token address as default token address. Used for supporting TIME tokens
    /// @dev Allowed only for TimeHolder call
    ///
    /// @param _sharesContract TIME token address
    function setSharesContract(address _sharesContract) onlyTimeHolder public {
        require(_sharesContract != 0x0);
        store.set(sharesContractStorage, _sharesContract);
    }

    /// @notice Gets address of shares contract
    function getSharesContract() public view returns (address) {
        return store.get(sharesContractStorage);
    }

    /// @notice Gets total number of deposited tokens provided as parameter
    /// @param _token token address to get info
    function totalShares(address _token) public view returns (uint) {
        if (_token == store.get(sharesContractStorage)) {
            return store.get(totalSharesStorage);
        }

        return store.get(totalSharesStorage_v2, _token);
    }

    /// @notice Number of shareholders for provided token
    /// @return number of shareholders
    function shareholdersCount(address _token) public view returns (uint) {
        if (_token == store.get(sharesContractStorage)) {
            return store.count(shareholders);
        }

        return store.count(shareholders_v2, bytes32(_token));
    }

    /// @notice Gets token amount deposited by a particular shareholder.
    ///
    /// @param _token token that was deposited
    /// @param _depositor shareholder address.
    ///
    /// @return shares amount.
    function depositBalance(address _token, address _depositor) public view returns (uint _balance) {
        if (_token != store.get(sharesContractStorage)) {
            bytes32 _key = _compileCompositeKey(_token, _depositor);
            return _depositBalance(_key);
        }

        return _depositBalance(bytes32(_depositor));
    }

    /// @notice Deposits for a _target for provided _amount of specified tokens
    /// @dev Allowed only for TimeHolder call
    ///
    /// @param _token token to deposit. Should be in a whitelist
    /// @param _target deposit destination
    /// @param _amount amount of deposited tokens
    function depositFor(address _token, address _target, uint _amount) onlyTimeHolder public {
        uint id;
        uint prevAmount;

        if (_token == store.get(sharesContractStorage)) {
            store.add(shareholders, _target);

            id = store.get(depositsIdCounter) + 1;
            store.set(depositsIdCounter, id);
            _addDeposit(bytes32(_target), bytes32(id), _amount);

            prevAmount = store.get(totalSharesStorage);
            store.set(totalSharesStorage, _amount.add(prevAmount));
        } else {
            store.add(shareholders_v2, bytes32(_token), _target);

            bytes32 key = _compileCompositeKey(_token, _target);

            id = store.get(depositsIdCounters_v2, key) + 1;
            store.set(depositsIdCounters_v2, key, id);
            _addDeposit(key, bytes32(id), _amount);

            prevAmount = store.get(totalSharesStorage_v2, _token);
            store.set(totalSharesStorage_v2, _token, _amount.add(prevAmount));
        }
    }

    /// @notice Withdraws tokens back to provided account
    /// @dev Allowed only for TimeHolder call
    ///
    /// @param _token token address
    /// @param _account token recepient
    /// @param _amount number of tokens to withdraw
    /// @param _totalBalance total balance of shares
    function withdrawShares(address _token, address _account, uint _amount, uint _totalBalance) onlyTimeHolder public {
        if (_totalBalance == 0) {
            return;
        }

        if (_token == store.get(sharesContractStorage)) {
            uint deposits_count_left_v1 = _withdrawShares(bytes32(_account), _amount);

            if (deposits_count_left_v1 == 0) {
                store.remove(shareholders, _account);
            }

            uint prevAmount_v1 = store.get(totalSharesStorage);
            store.set(totalSharesStorage, prevAmount_v1.sub(_amount));
        } else {
            bytes32 _key = _compileCompositeKey(_token, _account);
            uint deposits_count_left_v2 = _withdrawShares(_key, _amount);

            if (deposits_count_left_v2 == 0) {
                store.remove(shareholders_v2, bytes32(_token), _account);
            }

            uint prevAmount_v2 = store.get(totalSharesStorage_v2, _token);
            store.set(totalSharesStorage_v2, _token, prevAmount_v2.sub(_amount));
        }
    }

    /// @dev Iterates through deposits and calculates a sum
    function _depositBalance(bytes32 _key) private view returns (uint _balance) {
        StorageInterface.Iterator memory iterator = store.listIterator(deposits, _key);
        for (uint i = 0; store.canGetNextWithIterator(deposits, iterator); ++i) {
            uint _cur_amount = uint(store.get(amounts_v2, _key, bytes32(store.getNextWithIterator(deposits, iterator))));
            _balance = _balance.add(_cur_amount);
        }
    }

    /// @dev Saves deposit data with provided key
    ///
    /// @param _key might be a compositeKey or an account address
    /// @param _id index of deposit
    /// @param _amount amount of tokens to deposit
    function _addDeposit(bytes32 _key, bytes32 _id, uint _amount) private {
        store.add(deposits, _key, uint(_id));
        store.set(amounts_v2, _key, _id, bytes32(_amount));
        store.set(timestamps_v2, _key, _id, bytes32(now));
    }

    /// @dev Withdraws tokens for provided keys
    ///
    /// @param _key might be a compositeKey or an account address
    /// @param _amount amount of tokens to withdraw
    ///
    /// @return _deposits_count_left amount of tokens that is left on deposits
    function _withdrawShares(bytes32 _key, uint _amount) private returns (uint _deposits_count_left) {
        StorageInterface.Iterator memory iterator = store.listIterator(deposits, _key);
        _deposits_count_left = iterator.count();
        while (store.canGetNextWithIterator(deposits, iterator)) {
            uint _id = store.getNextWithIterator(deposits, iterator);
            (_deposits_count_left, _amount) = _withdrawSharesFromDepositV2(_key, _id, _amount, _deposits_count_left);
            if (_amount == 0) {
                break;
            }
        }
    }

    /// @dev Withdraws shares from one of made deposits.
    ///
    /// @param _key composite key from keccak256(symbol, user)
    /// @param _id deposit key
    /// @param _amount deposit amount to withdraw
    /// @param _depositsLeft number of deposits left
    ///
    /// @return {
    ///   updated deposits left,
    ///   updated amount left,
    /// }
    function _withdrawSharesFromDepositV2(bytes32 _key, uint _id, uint _amount, uint _depositsLeft) private returns (uint, uint) {
        uint _cur_amount = uint(store.get(amounts_v2, _key, bytes32(_id)));
        if (_amount < _cur_amount) {
            store.set(amounts_v2, _key, bytes32(_id), bytes32(_cur_amount.sub(_amount)));
            return (_depositsLeft, 0);
        }

        store.remove(deposits, _key, _id);
        return (_depositsLeft.sub(1), _amount.sub(_cur_amount));
    }

    /// @dev Gets key combined from token symbol and user's address
    function _compileCompositeKey(address _token, address _address) private pure returns (bytes32) {
        return keccak256(_token, _address);
    }
}
