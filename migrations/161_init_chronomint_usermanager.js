const UserManager = artifacts.require("./UserManager.sol");
const StorageManager = artifacts.require("./StorageManager.sol");
const ContractsManager = artifacts.require("./ContractsManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let userManager = await UserManager.deployed();

        let required = await userManager.required();
        if (required < 2) {
            let result = await userManager.setRequired.call(2);
            if (result == 1) {
                await userManager.setRequired(2);
                console.log("Required now is ", await userManager.required());
            } else {
                console.log("[WARNING] Required is still equal to", await userManager.required());
            }
        }

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] UserManager update required: #done")
    })
}
