var VotingManager = artifacts.require('VotingManager')
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(VotingManager, Storage.address, "VotingManager_v1")

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Voting Manager deploy: #done`)
	})
}
