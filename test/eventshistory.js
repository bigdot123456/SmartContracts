const Rewards = artifacts.require("./Rewards.sol");
const AssetsManager = artifacts.require("./AssetsManager.sol");
const PlatformsManager = artifacts.require("./PlatformsManager.sol");
const ExchangeManager = artifacts.require("./ExchangeManager.sol");
const PendingManager = artifacts.require("./PendingManager.sol");
const FeatureFeeManager = artifacts.require("./FeatureFeeManager.sol");
const WalletsManager = artifacts.require("./WalletsManager.sol");
const BaseManager = artifacts.require("./BaseManager.sol");
const VotingManager = artifacts.require("./VotingManager.sol");
const TimeHolder = artifacts.require("./TimeHolder.sol");
const LOCManager = artifacts.require('./LOCManager.sol')
const UserManager = artifacts.require("./UserManager.sol");
const MultiEventsHistory = artifacts.require('./MultiEventsHistory.sol');
const ERC20Manager = artifacts.require('./ERC20Manager.sol')

contract('MultiEventsHistory', (accounts) => {
    let managerContracts =
    [
        AssetsManager,
        PlatformsManager,
        ERC20Manager,
        UserManager,
        ExchangeManager,
        LOCManager,
        PendingManager,
        Rewards,
        FeatureFeeManager,
        TimeHolder,
        VotingManager,
        WalletsManager
    ]

    before('Setup', async() => {
    });

    for (var managerContract of managerContracts) {
        let artifact = managerContract;
        it(`should be installed in ${artifact.contractName}`, async () => {
            let manager = await artifact.deployed();
            assert.equal(MultiEventsHistory.address, await manager.getEventsHistory());
        });
    }
});
