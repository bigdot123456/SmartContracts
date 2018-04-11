var PollBackend = artifacts.require('PollBackend')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(PollBackend)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Poll Backend deploy: #done`)
	})
}
