const ChronoBankAssetWithFee = artifacts.require("ChronoBankAssetWithFee")
const ChronoBankAsset = artifacts.require("ChronoBankAsset")
const ChronoBankAssetProxy = artifacts.require("ChronoBankAssetProxy")
const ChronoBankAssetWithFeeProxy = artifacts.require("ChronoBankAssetWithFeeProxy")
const RewardsWallet = artifacts.require("RewardsWallet")
const ERC20Manager = artifacts.require("ERC20Manager")
const ChronoBankPlatform = artifacts.require('ChronoBankPlatform')
const path = require("path")

module.exports = function(deployer, network, accounts) {
	const TIME_SYMBOL = 'TIME'
	const TIME_NAME = 'Time Token'
	const TIME_DESCRIPTION = 'ChronoBank Time Shares'
	const TIME_BASE_UNIT = 8

	//----------
	const LHT_SYMBOL = 'LHT'
	const LHT_NAME = 'Labour-hour Token'
	const LHT_DESCRIPTION = 'ChronoBank Lht Assets'
	const LHT_BASE_UNIT = 8

	const systemOwner = accounts[0]

	deployer.then(async () => {
		const erc20Manager = await ERC20Manager.deployed()
		const chronoBankPlatform = await ChronoBankPlatform.deployed()

		if (network !== 'main') {
			const chronoBankAssetProxy = await ChronoBankAssetProxy.deployed()
			await chronoBankPlatform.setProxy(ChronoBankAssetProxy.address, TIME_SYMBOL)
			await chronoBankAssetProxy.proposeUpgrade(ChronoBankAsset.address)
			await erc20Manager.addToken(ChronoBankAssetProxy.address, TIME_NAME, TIME_SYMBOL, "", LHT_BASE_UNIT, "", "")
		}

		const chronoBankAssetWithFeeProxy = await ChronoBankAssetWithFeeProxy.deployed()
		const chronoBankAssetWithFee = await ChronoBankAssetWithFee.deployed()
		await chronoBankPlatform.setProxy(ChronoBankAssetWithFeeProxy.address, LHT_SYMBOL)
		await chronoBankAssetWithFeeProxy.proposeUpgrade(ChronoBankAssetWithFee.address)
		await chronoBankAssetWithFee.setupFee(RewardsWallet.address, 100)
		// await erc20Manager.addToken(ChronoBankAssetWithFeeProxy.address, LHT_NAME, LHT_SYMBOL, "", LHT_BASE_UNIT, "", "")

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Setup assets: #done`)
	})
}
