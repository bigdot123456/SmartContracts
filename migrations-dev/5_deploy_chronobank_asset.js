var ChronoBankAsset = artifacts.require("ChronoBankAsset")
const ChronoBankAssetProxy = artifacts.require("ChronoBankAssetProxy")
const path = require("path")

module.exports = function(deployer, network) {
	if (network !== 'main') {
		deployer.then(async () => {
			await deployer.deploy(ChronoBankAsset)
			const asset = await ChronoBankAsset.deployed()
			await asset.init(ChronoBankAssetProxy.address)

			console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ChronoBankAsset: #done`)
		})
	}
}
