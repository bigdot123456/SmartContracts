const Rewards = artifacts.require("./Rewards.sol");
const StorageManager = artifacts.require("./StorageManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol")

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.blockAccess(Rewards.address, "Deposits")

        let history = await MultiEventsHistory.deployed()
        await history.reject(Rewards.address)

        let contractsManager = await ContractsManager.deployed();
        await contractsManager.removeContract(Rewards.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Rewards destroy: #done")
    })
}
