const ERC20Manager = artifacts.require("ERC20Manager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(ERC20Manager.address, 'ERC20Manager')

		const erc20Manager = await ERC20Manager.deployed()
		await erc20Manager.init(ContractsManager.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(erc20Manager.address)
		await erc20Manager.setEventsHistory(history.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ERC20 Manager setup: #done`)
	})
}
