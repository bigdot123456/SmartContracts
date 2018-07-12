var PollBackend = artifacts.require('./PollBackend.sol')
const PollBackendProvider = artifacts.require('./PollBackendProvider.sol')
const ContractsManager = artifacts.require('./ContractsManager.sol')

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployer.deploy(PollBackend)

        const pollBackend = await PollBackend.deployed()
        await pollBackend.init(ContractsManager.address)

        const backendProvider = await PollBackendProvider.deployed()
        await backendProvider.setPollBackend(PollBackend.address)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] PollBackend deploy: #done")
    })
}
