pragma solidity ^0.4.11;

import "./FakeCoin.sol";

// For testing purposes.
contract FakeCoin3 is FakeCoin {

    function symbol() public pure returns(string) {
        return 'FAKE3';
    }
}
