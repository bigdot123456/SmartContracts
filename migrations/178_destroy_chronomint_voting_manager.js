const VotingManager = artifacts.require("./VotingManager.sol")
const StorageManager = artifacts.require("./StorageManager.sol")
const ContractsManager = artifacts.require('./ContractsManager.sol')
const TimeHolder = artifacts.require('./TimeHolder.sol')
const ERC20Manager = artifacts.require('./ERC20Manager.sol')
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol")

module.exports = function(deployer, network) {
    deployer.then(async () => {
        let storageManager = await StorageManager.deployed()
        await storageManager.blockAccess(VotingManager.address, "VotingManager_v1")

        let history = await MultiEventsHistory.deployed()
        await history.reject(VotingManager.address)

        let contractsManager = await ContractsManager.deployed();
        await contractsManager.removeContract(VotingManager.address);

        let erc20Manager = await ERC20Manager.deployed();
        let timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME");

        let timeHolder = await TimeHolder.deployed();
        await timeHolder.removeListener(timeAddress, VotingManager.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] VotingManager destroy: #done")
    })
}
