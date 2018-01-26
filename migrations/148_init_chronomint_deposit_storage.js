const Rewards = artifacts.require("./Rewards.sol");
const RewardsWallet = artifacts.require("./RewardsWallet.sol")
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const PlatformsManager = artifacts.require('./PlatformsManager.sol')
const ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol')

const ERC20DepositStorage = artifacts.require("./ERC20DepositStorage.sol")

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.giveAccess(ERC20DepositStorage.address, "Deposits")

        let erc20DepositStorage = await ERC20DepositStorage.deployed()
        await erc20DepositStorage.init(ContractsManager.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] ERC20DepositStorage init: #done")
    })
}
