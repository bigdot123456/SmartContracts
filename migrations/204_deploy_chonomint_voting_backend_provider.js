const PollBackendProvider = artifacts.require('./PollBackendProvider.sol')

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployer.deploy(PollBackendProvider)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] PollBackend deploy: #done")
    })
}
