const Rewards = artifacts.require("Rewards")
const RewardsWallet = artifacts.require("RewardsWallet")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const ChronoBankPlatform = artifacts.require('ChronoBankPlatform')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(Rewards.address, "Deposits")

		const rewards = await Rewards.deployed()
		await rewards.init(ContractsManager.address, RewardsWallet.address, ChronoBankPlatform.address, 0)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(Rewards.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Rewards setup: #done`)
	})
}
