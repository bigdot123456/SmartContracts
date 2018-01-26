var Rewards = artifacts.require("./Rewards.sol");
const Storage = artifacts.require('./Storage.sol');

var ERC20DepositStorage = artifacts.require("./ERC20DepositStorage.sol")

module.exports = function (deployer, network) {
    deployer
    .then(() => deployer.deploy(ERC20DepositStorage, Storage.address, "Deposits"))
    .then(() => console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] ERC20DepositStorage deployed: #done"))
}
