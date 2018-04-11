const TokenFactory = artifacts.require("TokenFactory")
const ChronoBankAssetFactory = artifacts.require("ChronoBankAssetFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ChronoBankAssetFactory)

		const proxyFactory = await TokenFactory.deployed()
		await proxyFactory.setAssetFactory("ChronoBankAsset", ChronoBankAssetFactory.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAssetFactory deploy: #done`)
	})
}
