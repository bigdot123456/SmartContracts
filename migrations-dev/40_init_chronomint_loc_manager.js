const LOCManager = artifacts.require("LOCManager")
const LOCWallet = artifacts.require("LOCWallet")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(LOCManager.address, 'LOCManager')

		const locManager = await LOCManager.deployed()
		await locManager.init(ContractsManager.address, LOCWallet.address)

		const history = await MultiEventsHistory.deployed()
		await locManager.setEventsHistory(history.address)
		await history.authorize(LOCManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] LOC Manager setup: #done`)
	})
}
