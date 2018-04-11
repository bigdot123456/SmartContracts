const WalletsFactory = artifacts.require("WalletsFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(WalletsFactory)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Wallets Factory: #done`)
	})
}
