var PollBackend = artifacts.require('./PollBackend.sol')

module.exports = async (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployer.deploy(PollBackend)

        console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] PollBackend deploy: #done")
    })
}
