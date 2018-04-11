var ChronoBankAssetWithFee = artifacts.require("ChronoBankAssetWithFee")
const ChronoBankAssetWithFeeProxy = artifacts.require("ChronoBankAssetWithFeeProxy")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(ChronoBankAssetWithFee)

		const asset = await ChronoBankAssetWithFee.deployed()
		await asset.init(ChronoBankAssetWithFeeProxy.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAssetWithFee: #done`)
	})
}
