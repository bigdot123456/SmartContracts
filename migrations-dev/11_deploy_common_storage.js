const Storage = artifacts.require('Storage')
const StorageInterface = artifacts.require('StorageInterface')
const StorageManager = artifacts.require('StorageManager')
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(Storage)
		await deployer.deploy(StorageInterface)
		await deployer.deploy(StorageManager)

		const storage = await Storage.deployed()
		await storage.setManager(StorageManager.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(StorageManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Storage Contracts: #done`)
	})
}
