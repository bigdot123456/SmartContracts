const TokenFactory = artifacts.require("TokenFactory")
const ChronoBankAssetWithFeeFactory = artifacts.require("ChronoBankAssetWithFeeFactory")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ChronoBankAssetWithFeeFactory)

		const proxyFactory = await TokenFactory.deployed()
		await proxyFactory.setAssetFactory("ChronoBankAssetWithFee", ChronoBankAssetWithFeeFactory.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAssetWithFeeFactory: #done`)
	})
}
