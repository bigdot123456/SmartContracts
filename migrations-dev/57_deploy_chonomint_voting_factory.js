var PollFactory = artifacts.require('PollFactory')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(PollFactory)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Voting entity Factory deploy: #done`)
	})
}
