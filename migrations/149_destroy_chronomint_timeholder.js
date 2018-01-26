const TimeHolder = artifacts.require("./TimeHolder.sol");
const StorageManager = artifacts.require('./StorageManager.sol');
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.blockAccess(TimeHolder.address, "Deposits")

        let history = await MultiEventsHistory.deployed()
        await history.reject(TimeHolder.address)

        let contractsManager = await ContractsManager.deployed();
        await contractsManager.removeContract(TimeHolder.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] TimeHolder destroy: #done")
    })
}
