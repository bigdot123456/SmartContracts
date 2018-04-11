const PendingManager = artifacts.require("PendingManager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(PendingManager.address, "PendingManager")

		const pendingManager = await PendingManager.deployed()
		await pendingManager.init(ContractsManager.address)

		const history = await MultiEventsHistory.deployed()
		await pendingManager.setEventsHistory(history.address)
		await history.authorize(PendingManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Pending Manager setup: #done`)
	})
}
