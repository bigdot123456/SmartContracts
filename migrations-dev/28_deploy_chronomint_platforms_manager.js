var PlatformsManager = artifacts.require("PlatformsManager")
const Storage = artifacts.require("Storage")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(PlatformsManager, Storage.address, "PlatformsManager")

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Platforms Manager deploy: #done`)
	})
}
