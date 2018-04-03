const FeatureFeeManager = artifacts.require("FeatureFeeManager")
const StorageManager = artifacts.require('StorageManager')
const ContractsManager = artifacts.require("ContractsManager")
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        const storageManager = await StorageManager.deployed()
        await storageManager.giveAccess(FeatureFeeManager.address, 'FeatureFeeManager')
        
        const featureFeeRegistry = await FeatureFeeManager.deployed()
        await featureFeeRegistry.init(ContractsManager.address
        )
        const history = await MultiEventsHistory.deployed()
        await featureFeeRegistry.setEventsHistory(history.address)
        await history.authorize(featureFeeRegistry.address)

        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] FeatureFee Manager setup: #done`)
    })
}
