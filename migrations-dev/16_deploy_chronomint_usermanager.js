var UserManager = artifacts.require("UserManager")
const Storage = artifacts.require('Storage')
const StorageManager = artifacts.require('StorageManager')
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(UserManager, Storage.address, 'UserManager')

		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(UserManager.address, 'UserManager')

		const userManager = await UserManager.deployed()
		await userManager.init(ContractsManager.address)

		const history = await MultiEventsHistory.deployed()
		await userManager.setEventsHistory(history.address)
		await history.authorize(userManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] User Manager: #done`)
	})
}
