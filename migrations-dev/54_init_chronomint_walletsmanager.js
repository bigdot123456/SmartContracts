const WalletsManager = artifacts.require("WalletsManager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const WalletsFactory = artifacts.require("WalletsFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(WalletsManager.address, 'WalletsManager')

		const manager = await WalletsManager.deployed()
		await manager.init(ContractsManager.address, WalletsFactory.address)

		const events = await MultiEventsHistory.deployed()
		await events.authorize(manager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Wallets Manager setup: #done`)
	})
}
