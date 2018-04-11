const AssetsManager = artifacts.require("AssetsManager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const TokenFactory = artifacts.require("TokenFactory")
const ChronoBankTokenExtensionFactory = artifacts.require("ChronoBankTokenExtensionFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(AssetsManager.address, 'AssetsManager')

		const assetsManager = await AssetsManager.deployed()
		await assetsManager.init(ContractsManager.address, ChronoBankTokenExtensionFactory.address, TokenFactory.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(assetsManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Assets Manager setup: #done`)
	})
}
