var FakeCoin = artifacts.require("FakeCoin")
var FakeCoin2 = artifacts.require("FakeCoin2")
var FakeCoin3 = artifacts.require("FakeCoin3")
var ManagerMock = artifacts.require("ManagerMock")
var AssetsManagerMock = artifacts.require("AssetsManagerMock")
var Stub = artifacts.require("Stub")
var ChronoBankPlatformTestable = artifacts.require("ChronoBankPlatformTestable")
var KrakenPriceTicker = artifacts.require("KrakenPriceTicker")
var StorageManager = artifacts.require("StorageManager")
var FakePriceTicker = artifacts.require("FakePriceTicker")
var Clock = artifacts.require("Clock")
const path = require("path")

module.exports = (deployer, network) => {
	if (network === 'development' || network === 'test') {
		deployer.then(async () => {
			await deployer.deploy(Stub)
			await deployer.deploy(ChronoBankPlatformTestable)
			await deployer.deploy(FakeCoin)
			await deployer.deploy(FakeCoin2)
			await deployer.deploy(FakeCoin3)
			await deployer.deploy(FakePriceTicker)
			await deployer.deploy(ManagerMock)
			await deployer.deploy(Clock)
			await deployer.deploy(AssetsManagerMock)

			const storageManager = await StorageManager.deployed()
			await storageManager.giveAccess(AssetsManagerMock.address, 'AssetsManager')

			await deployer.deploy(KrakenPriceTicker, true)

			console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Test Contracts deploy: #done`)
		})
	}
}
