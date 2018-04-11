var LOCWallet = artifacts.require("LOCWallet")
const Storage = artifacts.require("Storage")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(LOCWallet, Storage.address, 'LOCWallet')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] LOC Wallet deploy: #done`)
	})
}
