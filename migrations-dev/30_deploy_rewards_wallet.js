var RewardsWallet = artifacts.require("RewardsWallet")
const Storage = artifacts.require("Storage")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(RewardsWallet, Storage.address, 'RewardsWallet')

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Rewards Wallet deploy: #done`)
	})
}
