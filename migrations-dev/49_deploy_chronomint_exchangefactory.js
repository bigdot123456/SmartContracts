var ExchangeFactory = artifacts.require("ExchangeFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ExchangeFactory)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Exchange Factory: #done`)
	})
}
