const SafeMath = artifacts.require('SafeMath')
const StringsLib = artifacts.require('StringsLib')
const SetStorageInterface_v_1_1 = artifacts.require("SetStorageInterface_v_1_1")
const ERC20Manager = artifacts.require("ERC20Manager")

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(SafeMath)
		await deployer.deploy(StringsLib)
		await deployer.deploy(SetStorageInterface_v_1_1)
		
		await deployer.link(SetStorageInterface_v_1_1, [ERC20Manager,])
        
        console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Libraries deploy: #done`)
	})
}
