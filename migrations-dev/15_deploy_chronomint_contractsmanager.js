var ContractsManager = artifacts.require("ContractsManager")
const Storage = artifacts.require('Storage')
const StorageManager = artifacts.require('StorageManager')
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ContractsManager, Storage.address, 'ContractsManager')
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(ContractsManager.address, 'ContractsManager')

		const contractsManager = await ContractsManager.deployed()
		await contractsManager.addContract(MultiEventsHistory.address, "MultiEventsHistory")
		await contractsManager.addContract(StorageManager.address, "StorageManager")

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Contracts Manager: #done`)
	})
}
