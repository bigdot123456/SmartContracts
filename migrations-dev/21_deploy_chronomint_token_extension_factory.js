var ChronoBankTokenExtensionFactory = artifacts.require('ChronoBankTokenExtensionFactory')
const ContractsManager = artifacts.require('ContractsManager')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ChronoBankTokenExtensionFactory, ContractsManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Token Management Extension Factory deploy: #done`)
	})
}
