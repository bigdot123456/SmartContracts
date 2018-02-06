const ERC20Manager = artifacts.require("./ERC20Manager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let history = await MultiEventsHistory.deployed();

        let erc20Manager = await ERC20Manager.deployed();
        await erc20Manager.setEventsHistory(history.address);
        await history.authorize(ERC20Manager.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] MultiEventsHistory setup: #done")
    })
}
