var ERC20Manager = artifacts.require("ERC20Manager");
const Storage = artifacts.require('Storage');
const StorageManager = artifacts.require("StorageManager");
const ContractsManager = artifacts.require("ContractsManager");
const MultiEventsHistory = artifacts.require("MultiEventsHistory");
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed();
        await storageManager.giveAccess(ERC20Manager.address, 'ERC20Manager');

        let manager = await ERC20Manager.deployed();
        await manager.init(ContractsManager.address);

        let events = await MultiEventsHistory.deployed();
        await events.authorize(manager.address);

        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ERC20Manager setup: #done`)
    });
}
