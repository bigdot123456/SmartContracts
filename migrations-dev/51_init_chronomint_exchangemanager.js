var ExchangeManager = artifacts.require("ExchangeManager")
var ExchangeFactory = artifacts.require("ExchangeFactory")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(ExchangeManager.address, 'ExchangeManager')

		const exchangeManager = await ExchangeManager.deployed()
		await exchangeManager.init(ContractsManager.address, ExchangeFactory.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(exchangeManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Exchange Manager setup: #done`)
	})
}
