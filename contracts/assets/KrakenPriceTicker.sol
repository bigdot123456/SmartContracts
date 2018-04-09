/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/*
   Universal price ticker

   This contract keeps in storage an updated Token price,
   which is updated every ~60 seconds.
*/

pragma solidity ^0.4.11;
import "../core/common/Managed.sol";
import "../core/common/Owned.sol";

contract KrakenPriceTicker is Owned {

    address delegate;

    string public rate;
    string public url;  // for example "https://api.kraken.com/0/public/Ticker?pair=ETHXBT";
    string public formater; //for example "result.XETHXXBT.c.0";
    uint public interval = 1;

    event newOraclizeQuery(string description);
    event newKrakenPriceTicker(string price);

    function init(bool _dev, string _url, string _formater) {
        url = _url;
        formater = _formater;
    }

    function __callback(bytes32 myid, string result, bytes proof) {
        revert();

        rate = result;
        newKrakenPriceTicker(rate);
    }

    function setURL(string _url) onlyContractOwner returns(bool) {
        url = _url;
        return true;
    }

    function setFormater(string _formater) onlyContractOwner returns(bool) {
        formater = _formater;
        return true;
    }

    function setInterval(uint _interval) onlyContractOwner  returns(bool) {
        interval = _interval;
        return true;
    }

    function update() payable {
        revert();
    }

}
