var PendingManager = artifacts.require("PendingManager")
const Storage = artifacts.require("Storage")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(PendingManager, Storage.address, 'PendingManager')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Pending Manager deploy: #done`)
	})
}
