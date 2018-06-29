const StorageManager = artifacts.require("./StorageManager.sol");
const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol");
const ContractsManager = artifacts.require("ContractsManager")
const path = require("path")

module.exports = (deployer, network, accounts) => {
	deployer.then(async () => {
		let contractsManager = await ContractsManager.deployed()

		if (network !== "development") {
			let rewards;
			if (network === "main") {
				rewards = "0x6af80eac8a6b38e0cc15eef96308ed41b0fcd8c8"
			} else if (network === "rinkeby") {
				rewards = "0x6c7d81c56710dd90072a9226904aa97f48bead43"
			} else if (network === "kovan") {
				rewards = "0x20a84fdbc3b78ce7c1f25ff3b9636d688cb30020"
			}

			let storageManager = await StorageManager.deployed()
			await storageManager.blockAccess(rewards, "Deposits")

			let history = await MultiEventsHistory.deployed();
			await history.reject(rewards)

			await contractsManager.removeContract(rewards);
		}

		// otherwise Exchange will stop working
		await contractsManager.addContract(accounts[0], "Rewards")

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] TimeHolder destroy: #done`)
	})
}
