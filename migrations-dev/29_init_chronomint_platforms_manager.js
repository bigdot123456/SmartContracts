const PlatformsManager = artifacts.require("PlatformsManager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const ChronoBankPlatformFactory = artifacts.require("ChronoBankPlatformFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(PlatformsManager.address, "PlatformsManager")

		const platformsManager = await PlatformsManager.deployed()
		await platformsManager.init(ContractsManager.address, ChronoBankPlatformFactory.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(platformsManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Platforms Manager setup: #done`)
	})
}
