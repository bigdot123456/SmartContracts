var ChronoBankPlatformFactory = artifacts.require('ChronoBankPlatformFactory')
var MultiEventsHistory = artifacts.require('MultiEventsHistory')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ChronoBankPlatformFactory)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(ChronoBankPlatformFactory.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankPlatform Factory deploy: #done`)
	})
}
