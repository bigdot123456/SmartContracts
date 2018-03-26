const VotingManager = artifacts.require("./VotingManager.sol")
const ERC20Manager = artifacts.require("./ERC20Manager.sol")
const StorageManager = artifacts.require("./StorageManager.sol")
const ContractsManager = artifacts.require('./ContractsManager.sol')
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol")
const PollFactory = artifacts.require("./PollFactory.sol")
const PollBackend = artifacts.require('./PollBackend.sol')
const TimeHolder = artifacts.require('./TimeHolder.sol')

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let _storageManager = await StorageManager.deployed();
        await _storageManager.giveAccess(VotingManager.address, "VotingManager_v1");

        let _votingManager = await VotingManager.deployed();
        await _votingManager.init(ContractsManager.address, PollFactory.address, PollBackend.address);

        let _history = await MultiEventsHistory.deployed();
        await _history.authorize(VotingManager.address);

        let erc20Manager = await ERC20Manager.deployed();
        let timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME");

        let _timeholder = await TimeHolder.deployed();
        await _timeholder.addListener(timeAddress, VotingManager.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Voting Manager init: #done")
    })
}
