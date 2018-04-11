const TokenFactory = artifacts.require("TokenFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(TokenFactory)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Token Factory deploy: #done`)
	})
}
