var LOCManager = artifacts.require("LOCManager")
const Storage = artifacts.require("Storage")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(LOCManager, Storage.address, 'LOCManager')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] LOC Manager deploy: #done`)
	})
}
