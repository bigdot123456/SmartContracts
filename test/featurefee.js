const Setup = require('../setup/setup')
const ErrorsEnum = require("../common/errors")
const eventsHelper = require('./helpers/eventsHelper')
const FeatureFeeManager = artifacts.require('./FeatureFeeManager.sol')
const AssetDonator = artifacts.require('./AssetDonator.sol')
const WalletsManager = artifacts.require('./WalletsManager.sol')
const ERC20Manager = artifacts.require('./ERC20Manager.sol')
const TimeHolder = artifacts.require('./TimeHolder.sol')
const ChronoBankAssetProxy = artifacts.require('./ChronoBankAssetProxy.sol')

contract("FeatureFeeManager", function(accounts) {
    let featureFeeManager;
    let assetDonator;
    let walletsManager;
    let timeHolder;
    let timeHolderWallet;
    let feeHolderWallet;
    let TIME;

    let timeHolder1 = accounts[2];
    let timeHolder2 = accounts[3];
    let timeHolder3 = accounts[4];
    let timeHolder4 = accounts[5];

    let owner = accounts[0];

    const CreateWalletFeatureRequiredBalance = 2;
    const CreateWalletFeatureFee = 1;

    before("setup", function(done) {
        FeatureFeeManager.deployed()
        .then(_featureFeeManager => featureFeeManager = _featureFeeManager)
        .then(() => TimeHolder.deployed())
        .then(_timeHolder => timeHolder = _timeHolder)
        .then(() => timeHolder.wallet.call())
        .then(_timeHolderWallet => timeHolderWallet = _timeHolderWallet)
        .then(() => timeHolder.feeWallet.call())
        .then(_feeHolderWallet => feeHolderWallet = _feeHolderWallet)
        .then(() => ERC20Manager.deployed())
        .then(erc20Manager => erc20Manager.getTokenAddressBySymbol.call("TIME"))
        .then(timeAddress => ChronoBankAssetProxy.at(timeAddress))
        .then(_TIME => TIME = _TIME)
        .then(() => AssetDonator.deployed())
        .then((_assetDonator) => assetDonator = _assetDonator)

        .then(() => WalletsManager.deployed())
        .then((_walletsManager) => walletsManager = _walletsManager)
        .then(() => {
            let sig = walletsManager.contract.createWallet.getData([0],0,0).slice(0, 10);
            return featureFeeManager.setFeatureFee(WalletsManager.address, sig, CreateWalletFeatureRequiredBalance, CreateWalletFeatureFee);
        })

        .then(() => assetDonator.sendTime({from: timeHolder1}))
        .then(() => TIME.approve(timeHolderWallet, 10000, {from: timeHolder1}))
        .then(() => timeHolder.deposit(TIME.address, 10000, {from : timeHolder1}))
        .then(() => Setup.setup(done))
    })

    it("should allow to execute WalletsManager#createWallet() account with deposit > feature_price", async () => {
        let holderBalance;
        let feeWalletBalance;

        return Promise.resolve()
        .then(() => timeHolder.depositBalance.call(timeHolder1))
        .then(_balance => {
            holderBalance = _balance;
            assert.isTrue(holderBalance >= CreateWalletFeatureRequiredBalance)
        })
        .then(() => TIME.balanceOf(feeHolderWallet))
        .then(_feeWalletBalance => feeWalletBalance = _feeWalletBalance)
        .then(() => walletsManager.createWallet.call([timeHolder1, timeHolder2], 1, 0,  {from :timeHolder1}))
        .then(r => assert.equal(r, ErrorsEnum.OK))
        .then(() => walletsManager.createWallet([timeHolder1, timeHolder2], 1, 0,  {from :timeHolder1}))
        .then(tx => eventsHelper.extractEvents(tx, "WalletCreated"))
        .then(events => assert.equal(events.length, 1))
        .then(() => timeHolder.depositBalance.call(timeHolder1))
        .then(_balance => assert.equal(holderBalance - _balance, CreateWalletFeatureFee))
        .then(() => TIME.balanceOf(feeHolderWallet))
        .then(_feeWalletBalance => assert.equal(_feeWalletBalance - feeWalletBalance, CreateWalletFeatureFee))
    })

    it("should not allow to execute WalletsManager#createWallet() account with deposit < feature_price", async () => {
        let holderBalance;

        return Promise.resolve()
        .then(() => timeHolder.depositBalance.call(timeHolder4))
        .then(_balance => {
            holderBalance = _balance;
            assert.isTrue(holderBalance <= CreateWalletFeatureRequiredBalance)
        })
        .then(() => walletsManager.createWallet.call([timeHolder1, timeHolder2], 1, 0,  {from :timeHolder4}))
        .then(r => assert.equal(r, ErrorsEnum.FEATURE_IS_UNAVAILABE))
        .then(() => walletsManager.createWallet([timeHolder1, timeHolder2], 1, 0,  {from :timeHolder4}))
        .then(tx => eventsHelper.extractEvents(tx, "WalletCreated"))
        .then(events => assert.equal(events.length, 0))
        .then(() => timeHolder.depositBalance.call(timeHolder4))
        .then(_balance => assert.equal(holderBalance.toNumber(), _balance.toNumber()))
    })

    it("should allow to execute ExchangeManager#createExchnage() account with deposit > feature_price",  async () => {
        const CreateExchangeFeatureRequiredBalance = 2;
        const CreateExchangeFeatureFee = 1;

        let sig = Setup.exchangeManager.contract.createExchange.getData("",0,0, false, 0x0, false).slice(0, 10);
        await featureFeeManager.setFeatureFee(Setup.exchangeManager.address, sig, CreateExchangeFeatureRequiredBalance, CreateExchangeFeatureFee);

        let holderBalance = await timeHolder.getDepositBalance.call(TIME.address, timeHolder1);
        assert.isTrue(holderBalance >= CreateExchangeFeatureRequiredBalance);
        assert.isTrue(holderBalance >= CreateExchangeFeatureFee);

        let feeWalletBalance = await TIME.balanceOf(feeHolderWallet);

        let result = await Setup.exchangeManager.createExchange.call("TIME", 1, 2, false, owner, true, {from: timeHolder1});
        assert.equal(result, ErrorsEnum.OK);

        let createExchangeTx = await Setup.exchangeManager.createExchange("TIME", 1, 2, false, owner, true, {from: timeHolder1});

        let events = eventsHelper.extractEvents(createExchangeTx, "ExchangeCreated");
        assert.equal(events.length, 1);

        assert.equal(web3.toBigNumber(holderBalance).sub(CreateExchangeFeatureFee).cmp(await timeHolder.getDepositBalance.call(TIME.address, timeHolder1)), 0);
        assert.equal(web3.toBigNumber(feeWalletBalance).add(CreateExchangeFeatureFee).cmp(await TIME.balanceOf(feeHolderWallet)), 0);
    })

    it("should not allow to execute ExchangeManager#createExchnage() account with deposit < feature_price",  async () => {
        const CreateExchangeFeatureRequiredBalance = 2;
        const CreateExchangeFeatureFee = 1;

        let sig = Setup.exchangeManager.contract.createExchange.getData("",0,0, false, 0x0, false).slice(0, 10);
        await featureFeeManager.setFeatureFee(Setup.exchangeManager.address, sig, CreateExchangeFeatureRequiredBalance, CreateExchangeFeatureFee);

        let holderBalance = await timeHolder.getDepositBalance.call(TIME.address, timeHolder4);
        assert.isTrue(holderBalance < CreateExchangeFeatureRequiredBalance);
        assert.isTrue(holderBalance < CreateExchangeFeatureFee);

        let feeWalletBalance = await TIME.balanceOf(feeHolderWallet);

        let result = await Setup.exchangeManager.createExchange.call("TIME", 1, 2, false, owner, true, {from: timeHolder4});
        assert.equal(result, ErrorsEnum.FEATURE_IS_UNAVAILABE);

        let createExchangeTx = await Setup.exchangeManager.createExchange("TIME", 1, 2, false, owner, true, {from: timeHolder4});

        assert.equal(web3.toBigNumber(holderBalance).cmp(await timeHolder.getDepositBalance.call(TIME.address, timeHolder4)), 0);
        assert.equal(web3.toBigNumber(feeWalletBalance).cmp(await TIME.balanceOf(feeHolderWallet)), 0);
    })

    it("should allow to execute TokenManagementInterface#createAssetWithoutFee() account with deposit > feature_price")

    it("should not allow to execute TokenManagementInterface#createAssetWithoutFee() account with deposit < feature_price")

    it("should allow to execute TokenManagementInterface#createAssetWithFee() account with deposit > feature_price")

    it("should not allow to execute TokenManagementInterface#createAssetWithFee() account with deposit < feature_price")

    it("should allow to execute TokenManagementInterface#createCrowdsaleCampaign() account with deposit > feature_price")

    it("should not allow to execute TokenManagementInterface#createCrowdsaleCampaign() account with deposit < feature_price")

    it("should allow to execute PlatformManager#createPlatform() account with deposit > feature_price",  async () => {
        const CreatePlatformFeatureRequiredBalance = 2;
        const CreatePlatformFeatureFee = 1;

        let sig = Setup.platformsManager.contract.createPlatform.getData().slice(0, 10);
        await featureFeeManager.setFeatureFee(Setup.platformsManager.address, sig, CreatePlatformFeatureRequiredBalance, CreatePlatformFeatureFee);

        let holderBalance = await timeHolder.depositBalance.call(timeHolder1);
        assert.isTrue(holderBalance >= CreatePlatformFeatureRequiredBalance);
        assert.isTrue(holderBalance >= CreatePlatformFeatureFee);

        let feeWalletBalance = await TIME.balanceOf(feeHolderWallet);

        let result = await Setup.platformsManager.createPlatform.call({from: timeHolder1});
        assert.equal(result, ErrorsEnum.OK);

        let createExchangeTx = await Setup.platformsManager.createPlatform({from: timeHolder1});

        let events = eventsHelper.extractEvents(createExchangeTx, "PlatformRequested");
        assert.equal(events.length, 1);

        assert.equal(web3.toBigNumber(holderBalance).sub(CreatePlatformFeatureFee).cmp(await timeHolder.depositBalance.call(timeHolder1)), 0);
        assert.equal(web3.toBigNumber(feeWalletBalance).add(CreatePlatformFeatureFee).cmp(await TIME.balanceOf(feeHolderWallet)), 0);
    })

    it("should not allow to execute PlatformManager#createPlatform() account with deposit < feature_price",  async () => {
        const CreatePlatformFeatureRequiredBalance = 2;
        const CreatePlatformFeatureFee = 1;

        let sig = Setup.platformsManager.contract.createPlatform.getData().slice(0, 10);
        await featureFeeManager.setFeatureFee(Setup.platformsManager.address, sig, CreatePlatformFeatureRequiredBalance, CreatePlatformFeatureFee);

        let holderBalance = await timeHolder.depositBalance.call(timeHolder4);
        assert.isTrue(holderBalance < CreatePlatformFeatureRequiredBalance);
        assert.isTrue(holderBalance < CreatePlatformFeatureFee);

        let feeWalletBalance = await TIME.balanceOf(feeHolderWallet);

        let result = await Setup.platformsManager.createPlatform.call({from: timeHolder4});
        assert.equal(result, ErrorsEnum.FEATURE_IS_UNAVAILABE);

        let createExchangeTx = await Setup.platformsManager.createPlatform({from: timeHolder4});

        assert.equal(web3.toBigNumber(holderBalance).cmp(await timeHolder.depositBalance.call(timeHolder4)), 0);
        assert.equal(web3.toBigNumber(feeWalletBalance).cmp(await TIME.balanceOf(feeHolderWallet)), 0);
    })
})
