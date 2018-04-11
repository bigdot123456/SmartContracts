const Setup = require('../setup/setup');
const bytes32 = require('./helpers/bytes32');
const Reverter = require('./helpers/reverter');
const ErrorsEnum = require("../common/errors")
const AssetDonator = artifacts.require('./AssetDonator.sol');
const ERC20Manager = artifacts.require('./ERC20Manager.sol');
const ERC20Interface = artifacts.require('./ERC20Interface.sol');

contract('AssetDonator', function(accounts) {
    let owner = accounts[0];
    let owner1 = accounts[1];
    let owner2 = accounts[2];
    let owner3 = accounts[3];
    let owner4 = accounts[4];
    let owner5 = accounts[5];
    let nonOwner = accounts[6];
    let assetDonator;

    const TIME_SYMBOL = 'TIME';
    const LHT_SYMBOL = 'LHT';

    before('setup', function(done) {
        AssetDonator.deployed()
        .then((_assetDonator) => assetDonator = _assetDonator)
        .then(() => Setup.setup(done))
    });

    it("Platform is able to transfer TIMEs for test purposes", async () => {
        let result = await assetDonator.sendTime.call({from: owner5});
        assert.isTrue(result);

        await assetDonator.sendTime({from: owner5});

        let erc20Manager = await ERC20Manager.deployed();
        let timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME");

        let time = ERC20Interface.at(timeAddress);
        assert.equal(await time.balanceOf.call(owner5), 1000000000);
    });

    it("Platform is unable to transfer TIMEs twice to the same account", async () => {
        let result = await assetDonator.sendTime.call({from: owner5});
        assert.isFalse(result);

        await assetDonator.sendTime({from: owner5});

        let erc20Manager = await ERC20Manager.deployed();
        let timeAddress = await erc20Manager.getTokenAddressBySymbol("TIME");

        let time = ERC20Interface.at(timeAddress);
        assert.equal(await time.balanceOf.call(owner5), 1000000000);
    });
});
