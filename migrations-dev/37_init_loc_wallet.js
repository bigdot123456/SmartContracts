const LOCWallet = artifacts.require("LOCWallet")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require("ContractsManager")
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(LOCWallet.address, 'LOCWallet')

		const wallet = await LOCWallet.deployed()
		await wallet.init(ContractsManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] LOC Wallet setup: #done`)
	})
}
