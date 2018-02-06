const TimeHolder = artifacts.require("./TimeHolder.sol");
const StorageManager = artifacts.require('./StorageManager.sol');
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");

module.exports = function(deployer, network) {
    deployer    
    .then(() => StorageManager.deployed())
    .then(_storageManager => _storageManager.blockAccess(TimeHolder.address, 'Deposits'))
    .then(() => MultiEventsHistory.deployed())
    .then(_history => _history.reject(TimeHolder.address))
    // NOTE: we don't do destroy since it is meaningless here (no storage variables will be freed)
    .then(() => ContractsManager.deployed())
    .then(_manager => _manager.removeContract(TimeHolder.address))

    .then(() => console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] TimeHolder destroyed: #done"))
}
