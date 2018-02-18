const UserManager = artifacts.require("./UserManager.sol");
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let userManager = await UserManager.deployed();
        await userManager.setRequired(2);

        console.log("Required now is ", await userManager.required());

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] UserManager update required: #done")
    })
}
