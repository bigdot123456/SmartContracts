const ERC20Manager = artifacts.require("ERC20Manager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require('ContractsManager')
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        const storageManager = await StorageManager.deployed()
        await storageManager.blockAccess(ERC20Manager.address, "ERC20Manager")
        
        const history = await MultiEventsHistory.deployed()
        await history.reject(ERC20Manager.address)

        const contractsManager = await ContractsManager.deployed()
        await contractsManager.removeContract(ERC20Manager.address)
        
        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ERC20Manager destroy: #done`)
    })
}
