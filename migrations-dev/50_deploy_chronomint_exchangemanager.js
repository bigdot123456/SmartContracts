var ExchangeManager = artifacts.require("ExchangeManager")
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ExchangeManager, Storage.address, 'ExchangeManager')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Exchange Manager deploy: #done`)
	})
}
