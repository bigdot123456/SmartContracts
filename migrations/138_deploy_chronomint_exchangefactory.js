var ExchangeFactory = artifacts.require("./ExchangeFactory.sol");

module.exports = function(deployer, network) {
    if (!ExchangeFactory.isDeployed()) {
        deployer.deploy(ExchangeFactory)
            .then(() => console.log("[MIGRATION] [138] ExchangeFactory: #done"))
    } else {
        console.log("[MIGRATION] [138] ExchangeFactory: #already deployed")
    }
}
