const FeatureFeeManager = artifacts.require("FeatureFeeManager")
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        await deployer.deploy(FeatureFeeManager, Storage.address, 'FeatureFeeManager')

        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] FeatureFee Manager: #done`)
    })
}
