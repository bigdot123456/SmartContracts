var AssetsManager = artifacts.require("AssetsManager")
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(AssetsManager, Storage.address, 'AssetsManager')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Assets Manager deploy: #done`)
	})
}
