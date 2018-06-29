var RewardsWallet = artifacts.require("./RewardsWallet.sol")
const Storage = artifacts.require('./Storage.sol');
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const PlatformsManager = artifacts.require('./PlatformsManager.sol')
const ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol')

module.exports = function (deployer, network) {
    deployer
    .then(() => deployer.deploy(RewardsWallet, Storage.address, 'RewardsWallet'))
    .then(() => StorageManager.deployed())
    .then(_storageManager => _storageManager.giveAccess(RewardsWallet.address, 'RewardsWallet'))
    .then(() => RewardsWallet.deployed())
    .then(_wallet => _wallet.init(ContractsManager.address))

    .then(() => console.log("[MIGRATION] [26] Rewards: #done"))
}
