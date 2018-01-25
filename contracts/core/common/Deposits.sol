pragma solidity ^0.4.11;

import "./BaseManager.sol";
import "../lib/SafeMath.sol";
import {ERC20Manager as ERC20Service} from "../erc20/ERC20Manager.sol";

/**
* @title Defines parent contract for working with deposits users make to participate in ecosystem and gain
* additional functionality (such as rewards, token holders and so forth).
*/
contract Deposits is BaseManager {

    using SafeMath for uint;


    /** Storage keys */

    StorageInterface.OrderedAddressesSet shareholders;
    StorageInterface.UIntOrderedSetMapping deposits;
    StorageInterface.UInt depositsIdCounter_old; // DEPRECATED. WILL BE REMOVED IN THE NEXT RELEASE
    StorageInterface.Bytes32UIntMapping depositsIdCounters;
    StorageInterface.Mapping amounts;
    StorageInterface.Mapping timestamps;
    StorageInterface.UInt totalSharesStorage_old; // DEPRECATED. WILL BE REMOVED IN THE NEXT RELEASE
    StorageInterface.AddressUIntMapping totalSharesStorage;
    StorageInterface.AddressesSet sharesTokenStorage;
    StorageInterface.Address defaultSharesTokenStorage;

    function Deposits(Storage _store, bytes32 _crate) BaseManager(_store, _crate) {
        shareholders.init('shareholders');
        deposits.init('deposits');
        depositsIdCounters.init('depositsIdCounters');
        amounts.init('amounts');
        timestamps.init('timestamps');
        totalSharesStorage.init('totalSharesStorage_v2');
        sharesTokenStorage.init('sharesContractsStorage');

        defaultSharesTokenStorage.init("defaultSharesTokenStorage");

        depositsIdCounter_old.init('depositsIdCounter'); // DEPRECATED. WILL BE REMOVED IN THE NEXT RELEASE
        totalSharesStorage_old.init('totalSharesStorage'); // DEPRECATED. WILL BE REMOVED IN THE NEXT RELEASE
    }

    function depositBalance(address _depositor) public view returns (uint _balance) {
        return getDepositBalance(store.get(defaultSharesTokenStorage), _depositor);
    }
    /// @dev Returns shares amount deposited by a particular shareholder.
    ///
    /// @param _token token symbol.
    /// @param _depositor shareholder address.
    ///
    /// @return _balance shares amount.
    function getDepositBalance(address _token, address _depositor) public constant returns (uint _balance) {
        bytes32 _key = getCompositeKey(_token, _depositor);
        StorageInterface.Iterator memory iterator = store.listIterator(deposits, _key);
        for (uint i = 0; store.canGetNextWithIterator(deposits, iterator); ++i) {
            uint _cur_amount = uint(store.get(amounts, _key, bytes32(store.getNextWithIterator(deposits, iterator))));
            _balance = _balance.add(_cur_amount);
        }
    }

    /// @dev Gets key combined from token symbol and user's address
    function getCompositeKey(address _token, address _address) internal constant returns (bytes32) {
        return keccak256(_token, _address);
    }

    function lookupERC20Service() internal constant returns (ERC20Service) {
        return ERC20Service(lookupManager("ERC20Manager"));
    }
}
