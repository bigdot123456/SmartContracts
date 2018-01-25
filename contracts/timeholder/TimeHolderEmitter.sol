pragma solidity ^0.4.11;

import '../core/event/MultiEventsHistoryAdapter.sol';

contract TimeHolderEmitter is MultiEventsHistoryAdapter {
    /**
    *  User deposited into current period.
    */
    event Deposit(address token, address who, uint amount);

    /**
    *  Shares withdrawn by a shareholder.
    */
    event WithdrawShares(address token, address who, uint amount, address receiver);

    /**
    *  Shares withdrawn by a shareholder.
    */
    event ListenerAdded(address listener, address token);

    /**
    * Shares listener is removed
    */
    event ListenerRemoved(address listener, address token);

    /**
    * Shares is added to whitelist and start be available to use
    */
    event SharesWhiteListAdded(address token);

    /**
    * Shares is removed from whitelist and stop being available to use
    */
    event SharesWhiteListChanged(address token, uint limit, bool indexed isAdded);

    /**
    * Fee for Feature is taken
    */
    event FeatureFeeTaken(address self, address indexed from, address indexed to, uint amount);

    /**
    *  Something went wrong.
    */
    event Error(address indexed self, uint errorCode);

    function emitDeposit(address token, address who, uint amount) public {
        Deposit(token, who, amount);
    }

    function emitWithdrawShares(address token, address who, uint amount, address receiver) public {
        WithdrawShares(token, who, amount, receiver);
    }

    function emitListenerAdded(address listener, address token) public {
        ListenerAdded(listener, token);
    }

    function emitListenerRemoved(address listener, address token) public {
        ListenerRemoved(listener, token);
    }

    function emitSharesWhiteListChanged(address token, uint limit, bool isAdded) public {
        SharesWhiteListChanged(token, limit, isAdded);
    }

    function emitFeatureFeeTaken(address _from, address _to, uint _amount) public {
        FeatureFeeTaken(_self(), _from, _to, _amount);
    }

    function emitError(uint error) public {
        Error(_self(), error);
    }
}
