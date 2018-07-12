const VotingManager = artifacts.require("./VotingManager.sol")
const ContractsManager = artifacts.require('./ContractsManager.sol')
const PollFactory = artifacts.require("./PollFactory.sol")
const PollBackendProvider = artifacts.require('./PollBackendProvider.sol')

module.exports = async (deployer, network) => {
    deployer.then(async () => {
        let contractsManager = await ContractsManager.deployed();
        await contractsManager.removeContract(VotingManager.address);
        
        let _votingManager = await VotingManager.deployed();
        await _votingManager.init(ContractsManager.address, PollFactory.address, PollBackendProvider.address);

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Voting Manager reinit: #done")
    })
}
