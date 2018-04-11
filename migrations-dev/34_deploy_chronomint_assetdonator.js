var AssetDonator = artifacts.require("AssetDonator")
const ContractsManager = artifacts.require("ContractsManager")
const path = require("path")

module.exports = (deployer, network) => {
	const TIME_SYMBOL = 'TIME'

	if (network !== 'main') {
		deployer.then(async () => {
			await deployer.deploy(AssetDonator)

			const assetDonator = await AssetDonator.deployed()
			await assetDonator.init(ContractsManager.address)

			console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Asset Donator: #done`)
		})
	}
}
