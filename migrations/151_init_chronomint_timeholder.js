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

        let erc20Manager = await ERC20Manager.deployed();
        let timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME");

        let timeHolder = await TimeHolder.deployed()
        await timeHolder.init(ContractsManager.address, timeAddress, TimeHolderWallet.address, accounts[0], ERC20DepositStorage.address)

        let history = await MultiEventsHistory.deployed()
        await history.authorize(TimeHolder.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] TimeHolder init: #done")
    })
}
