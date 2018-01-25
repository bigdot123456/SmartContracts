const Rewards = artifacts.require("./Rewards.sol");
const RewardsWallet = artifacts.require("./RewardsWallet.sol")
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const PlatformsManager = artifacts.require('./PlatformsManager.sol')
const ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol')

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.giveAccess(Rewards.address, "Deposits")

        let platformsManager = await PlatformsManager.deployed()
        let platformAddr = await platformsManager.getPlatformForUserAtIndex.call(accounts[0], 0);

        let rewards = await Rewards.deployed()
        await rewards.init(ContractsManager.address, RewardsWallet.address, platformAddr, 0)

        let history = await MultiEventsHistory.deployed()
        await history.authorize(Rewards.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Rewards init: #done")
    })
}
