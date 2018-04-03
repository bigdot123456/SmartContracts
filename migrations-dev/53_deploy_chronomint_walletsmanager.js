const WalletsManager = artifacts.require("WalletsManager")
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(WalletsManager, Storage.address, 'WalletsManager')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Wallets Manager deploy: #done`)
	})
}
