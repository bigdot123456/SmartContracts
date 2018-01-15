const WalletsManager = artifacts.require("./WalletsManager.sol");
const Wallet = artifacts.require("./Wallet.sol");
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const WalletsFactory = artifacts.require("./WalletsFactory.sol");

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed();
        await storageManager.giveAccess(WalletsManager.address, 'WalletsManager');

        let manager = await WalletsManager.deployed();
        await manager.init(ContractsManager.address, WalletsFactory.address);

        let events = await MultiEventsHistory.deployed();
        await events.authorize(manager.address);
                
        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] WalletsManager setup: #done")
    });
}
