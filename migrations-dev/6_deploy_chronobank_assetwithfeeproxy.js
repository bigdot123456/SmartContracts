var ChronoBankAssetWithFeeProxy = artifacts.require("ChronoBankAssetWithFeeProxy")
const ChronoBankPlatform = artifacts.require("ChronoBankPlatform")
const path = require("path")

module.exports = deployer => {
	const LHT_SYMBOL = 'LHT'
	const LHT_NAME = 'Labour-hour Token'
	const LHT_DESCRIPTION = 'ChronoBank Lht Assets'

	const BASE_UNIT = 8
	const IS_REISSUABLE = true
	// const IS_NOT_REISSUABLE = false

	deployer.then(async () => {
		const platform = await ChronoBankPlatform.deployed()

		await platform.issueAsset(LHT_SYMBOL, 0, LHT_NAME, LHT_DESCRIPTION, BASE_UNIT, IS_REISSUABLE)
		await deployer.deploy(ChronoBankAssetWithFeeProxy)

		const proxy = await ChronoBankAssetWithFeeProxy.deployed()
		await proxy.init(ChronoBankPlatform.address, LHT_SYMBOL, LHT_NAME)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAssetWithFeeProxy: #done`)
	})
}
