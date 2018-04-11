const VotingManager = artifacts.require("VotingManager")
const ERC20Manager = artifacts.require("ERC20Manager")
const StorageManager = artifacts.require("StorageManager")
const ContractsManager = artifacts.require('ContractsManager')
const MultiEventsHistory = artifacts.require("MultiEventsHistory")
const PollFactory = artifacts.require("PollFactory")
const PollBackend = artifacts.require('PollBackend')
const TimeHolder = artifacts.require('TimeHolder')
const path = require("path")

module.exports = deployer => {
	deployer.then(async () => {
		const storageManager = await StorageManager.deployed()
		await storageManager.giveAccess(VotingManager.address, "VotingManager_v1")

		const votingManager = await VotingManager.deployed()
		await votingManager.init(ContractsManager.address, PollFactory.address, PollBackend.address)

		const history = await MultiEventsHistory.deployed()
		await history.authorize(VotingManager.address)

		const erc20Manager = await ERC20Manager.deployed()
		const timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME")

		const timeholder = await TimeHolder.deployed()
		await timeholder.addListener(timeAddress, VotingManager.address)

		console.log(`[MIGRATION] [${parseInt(path.basename(__filename))}] Voting Manager setup: #done`)
	})
}
