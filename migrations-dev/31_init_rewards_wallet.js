const RewardsWallet = artifacts.require("RewardsWallet")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(RewardsWallet.address, 'RewardsWallet')

		const wallet = await RewardsWallet.deployed()
		await wallet.init(ContractsManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Rewards Wallet setup: #done`)
	})
}
