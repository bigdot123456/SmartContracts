
var PollBackend = artifacts.require('./PollBackend.sol')
var ContractsManager = artifacts.require('./ContractsManager.sol')
const PollBackendProvider = artifacts.require('./PollBackendProvider.sol')

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        const pollBackend = await PollBackend.deployed()
        await pollBackend.init(ContractsManager.address)

        const backendProvider = await PollBackendProvider.deployed()
        await backendProvider.setPollBackend(PollBackend.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] PollBackend deploy: #done")
    })
}
