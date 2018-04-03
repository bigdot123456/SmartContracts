const Storage = artifacts.require('Storage')
const StorageManager = artifacts.require('StorageManager')
const ContractsManager = artifacts.require("ContractsManager")
const TimeHolderWallet = artifacts.require('TimeHolderWallet')

const path = require("path")

module.exports = (deployer, network) => {
	deployer.then(async () => {
		await deployer.deploy(TimeHolderWallet, Storage.address, "TimeHolderWallet")

		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(TimeHolderWallet.address, 'Deposits')

		const wallet = await TimeHolderWallet.deployed()
		await wallet.init(ContractsManager.address)

		if (network === "main") {
			//await updatedTimeHolder.setLimitForTokenSymbol("TIME", 100000000);
		}
		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] TimiHolder Wallet: #done`)
	})
}
