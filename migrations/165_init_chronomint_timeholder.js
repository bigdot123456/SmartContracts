const TimeHolder = artifacts.require("./TimeHolder.sol");
const Storage = artifacts.require('./Storage.sol');
const StorageManager = artifacts.require('./StorageManager.sol');
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const ERC20Manager = artifacts.require("./ERC20Manager.sol");
const ERC20Interface = artifacts.require('ERC20Interface.sol')
const ChronoBankAssetProxy = artifacts.require("./ChronoBankAssetProxy.sol");
const TimeHolderWallet = artifacts.require('./TimeHolderWallet.sol')

const ERC20DepositStorage = artifacts.require("./ERC20DepositStorage.sol")

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.giveAccess(TimeHolder.address, "Deposits")

        let timeHolder = await TimeHolder.deployed()
        await timeHolder.setEventsHistory(MultiEventsHistory.address)
        await timeHolder.setContractsManager(ContractsManager.address)

        let contractsManager = await ContractsManager.deployed()
        await contractsManager.addContract(TimeHolder.address, "TimeHolder")

        let history = await MultiEventsHistory.deployed()
        await history.authorize(TimeHolder.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] TimeHolder init: #done")
    })
}
