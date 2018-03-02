const WalletsManager = artifacts.require("./WalletsManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const WalletsFactory = artifacts.require("./WalletsFactory.sol");

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let manager = await WalletsManager.deployed();
        await manager.init(ContractsManager.address, WalletsFactory.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] WalletsManager reinit: #done")
    })
}
