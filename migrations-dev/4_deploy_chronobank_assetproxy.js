var ChronoBankAssetProxy = artifacts.require("ChronoBankAssetProxy")
const ChronoBankPlatform = artifacts.require("ChronoBankPlatform")
const path = require("path")

module.exports = function(deployer,network) {
	if (network !== 'main') {
		const TIME_SYMBOL = 'TIME'
		const TIME_NAME = 'Time Token'
		const TIME_DESCRIPTION = 'ChronoBank Time Shares'

		const BASE_UNIT = 8
		// const IS_REISSUABLE = true
		const IS_NOT_REISSUABLE = false

		deployer.then(async () => {
			const platform = await ChronoBankPlatform.deployed()

			await platform.issueAsset(TIME_SYMBOL, 2000000000000, TIME_NAME, TIME_DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE)
			await deployer.deploy(ChronoBankAssetProxy)

			const proxy = await ChronoBankAssetProxy.deployed()
			await proxy.init(platform.address, TIME_SYMBOL, TIME_NAME)

			console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAssetProxy: #done`)
		})
	}
}
