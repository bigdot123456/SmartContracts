const SetStorageInterface_v_1_1 = artifacts.require("SetStorageInterface_v_1_1")
const ERC20Manager = artifacts.require("ERC20Manager")
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        await deployer.deploy(SetStorageInterface_v_1_1)

        await deployer.link(SetStorageInterface_v_1_1, [ERC20Manager,])
        
        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Storage Interface (old one version, with "Set", "AddressesSet" methods) deploy: #done`)
    })
}
