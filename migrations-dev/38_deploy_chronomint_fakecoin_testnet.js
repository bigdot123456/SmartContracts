var FakeCoin = artifacts.require("FakeCoin")
const path = require("path")

module.exports = function(deployer,network) {
	// deploy FakeCoin only in non-main networks
	if (network === 'main') {
		console.log("[MIGRATION] [36] Deploy FakeCoin: #skiped, main network")
	}
	else {
		// check whether FakeCoin has been already deployed or not
		if (!FakeCoin.isDeployed()) {
			return deployer.then(async () => {
				await deployer.deploy(FakeCoin)

				console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] FakeCoin deploy: #done`)
			})
		}

		console.log("[MIGRATION] [36] Deploy FakeCoin: #skiped, already deployed")
	}
}
