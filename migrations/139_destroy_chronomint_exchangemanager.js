var ExchangeManager = artifacts.require("./ExchangeManager.sol");
const StorageManager = artifacts.require("./StorageManager.sol")
const ContractsManager = artifacts.require('./ContractsManager.sol')
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol")

module.exports = function(deployer, network, accounts) {
    deployer
    .then(() => StorageManager.deployed())
    .then(_storageManager => _storageManager.blockAccess(ExchangeManager.address, "ExchangeManager"))
    .then(() => MultiEventsHistory.deployed())
    .then(_history => _history.reject(ExchangeManager.address))
    .then(() => ContractsManager.deployed())
    .then(_manager => _manager.removeContract(ExchangeManager.address))

    .then(() => console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] ExchangeManager destroy: #done"))
}
