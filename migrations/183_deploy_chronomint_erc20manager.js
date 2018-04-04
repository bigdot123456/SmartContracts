const ERC20Manager = artifacts.require("ERC20Manager")
const Storage = artifacts.require('Storage')
const path = require("path")

module.exports = deployer => {
    deployer.then(async () => {
        await deployer.deploy(ERC20Manager, Storage.address, "ERC20Manager")

        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] ERC20Manager deploy: #done`)
    })
}
