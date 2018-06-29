const ContractsManager = artifacts.require("./ContractsManager.sol");
const TimeHolder = artifacts.require("./TimeHolder.sol");
const ERC20DepositStorage = artifacts.require('./ERC20DepositStorage.sol')
const TimeHolderWallet = artifacts.require('./TimeHolderWallet.sol')
const LOCManager = artifacts.require('./LOCManager.sol')
const LOCWallet = artifacts.require('./LOCWallet.sol')
const FakeCoin = artifacts.require("./FakeCoin.sol");
const FakeCoin2 = artifacts.require("./FakeCoin2.sol");
const FakeCoin3 = artifacts.require("./FakeCoin3.sol");
const Stub = artifacts.require("./Stub.sol");
const UserManager = artifacts.require("./UserManager.sol");
const Roles2Library = artifacts.require("./Roles2Library.sol");
const AssetsManagerMock = artifacts.require("./AssetsManagerMock.sol");
const MultiEventsHistory = artifacts.require('./MultiEventsHistory.sol');
const Storage = artifacts.require("./Storage.sol");
const ERC20Manager = artifacts.require('./ERC20Manager.sol')
const PendingManager = artifacts.require('./PendingManager.sol')
const ManagerMock = artifacts.require('./ManagerMock.sol');

const Reverter = require('./helpers/reverter');
const bytes32 = require('./helpers/bytes32');
const eventsHelper = require('./helpers/eventsHelper');
const ErrorsEnum = require("../common/errors");

contract('TimeHolder', (accounts) => {
  let reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  const systemUser = accounts[0]
  const rootUser = systemUser
  const middlewareAuthorityAddress = accounts[5]

  const roles = {
    middlewareAuthority: 9
  }

  const registeredUnlockId = "0x000000fffffff"
  const secret = "password123"
  let secretLock

  let timeHolder;
  let erc20DepositStorage;
  let timeHolderWallet
  let storage;
  let pendingManager
  let userManager;
  let rolesLibrary
  let multiEventsHistory;
  let assetsManager;
  let chronoMint;
  let chronoMintWallet;
  let erc20Manager
  let shares;
  let asset1;
  let asset2;
  let helperContract

  const fakeArgs = [0,0,0,0,0,0,0,0];
  const ZERO_INTERVAL = 0;
  const SHARES_BALANCE = 1161;
  const CHRONOBANK_PLATFORM_ID = 1;

  let DEFAULT_SHARE_ADDRESS

  const STUB_PLATFORM_ADDRESS = 0x0

  let defaultInit = () => {
    return storage.setManager(ManagerMock.address)
    .then(() => erc20Manager.init(contractsManager.address))
    .then(() => {
        return Promise.resolve()
        .then(() => Promise.all([shares.symbol.call(), shares.decimals.call()]))
        .then(_details => erc20Manager.addToken(shares.address, "", _details[0], _details[1], "", 0x0, 0x0))
        .then(() => Promise.all([asset1.symbol.call(), asset1.decimals.call()]))
        .then(_details => erc20Manager.addToken(asset1.address, "", _details[0], _details[1], "", 0x0, 0x0))
        .then(() => Promise.all([asset2.symbol.call(), asset2.decimals.call()]))
        .then(_details => erc20Manager.addToken(asset2.address, "", _details[0], _details[1], "", 0x0, 0x0))
    })
    .then(() => pendingManager.init(contractsManager.address))
    .then(() => assetsManager.init(contractsManager.address))
    .then(() => chronoMintWallet.init(contractsManager.address))
    .then(() => chronoMint.init(contractsManager.address, chronoMintWallet.address))
    .then(() => userManager.init(contractsManager.address))
    .then(() => rolesLibrary.init(contractsManager.address))
    .then(() => timeHolderWallet.init(contractsManager.address))
    .then(() => erc20DepositStorage.init(contractsManager.address))
    .then(() => timeHolder.init(contractsManager.address, DEFAULT_SHARE_ADDRESS, timeHolderWallet.address, accounts[0], erc20DepositStorage.address))
    .then(() => assetsManager.addAsset(asset1.address, 'LHT', chronoMintWallet.address))
    .then(() => multiEventsHistory.authorize(pendingManager.address))
    .then(async () => {
      await rolesLibrary.setRootUser(rootUser, true, { from: systemUser, })
      await rolesLibrary.addUserRole(middlewareAuthorityAddress, roles.middlewareAuthority, { from: rootUser, })
      {
          const signature = timeHolder.contract.registerUnlockShares.getData("", 0x0, 0, 0x0, "").slice(0, 10)
          await rolesLibrary.addRoleCapability(roles.middlewareAuthority, timeHolder.address, signature, { from: rootUser, })
      }
      {
          const signature = timeHolder.contract.unregisterUnlockShares.getData("").slice(0, 10)
          await rolesLibrary.addRoleCapability(roles.middlewareAuthority, timeHolder.address, signature, { from: rootUser, })
      }
    })
  };

  let assertSharesBalance = (address, expectedBalance) => {
    return shares.balanceOf(address)
      .then((balance) => assert.equal(balance.toString(), '' + expectedBalance));
  };

  let assertAsset1Balance = (address, expectedBalance) => {
    return asset1.balanceOf(address)
      .then((balance) => assert.equal(balance.toString(), '' + expectedBalance));
  };

  let assertAsset2Balance = (address, expectedBalance) => {
    return asset2.balanceOf(address)
      .then((balance) => assert.equal(balance.toString(), '' + expectedBalance));
  };

  let assertDepositBalance = (address, expectedBalance) => {
    return timeHolder.depositBalance(address)
      .then((balance) => assert.equal(balance.toString(), '' + expectedBalance));
  };

  before('Setup', (done) => {

    Storage.new()
    .then((instance) => storage = instance)
    .then(() => AssetsManagerMock.deployed())
    .then((instance) => assetsManager = instance)
    .then(() => LOCWallet.new(storage.address, 'LOCWallet'))
    .then((instance) => chronoMintWallet = instance)
    .then(() => LOCManager.new(storage.address, 'LOCManager'))
    .then((instance) => chronoMint = instance)
    .then(() => TimeHolderWallet.new(storage.address, 'TimeHolderWallet'))
    .then(instance => timeHolderWallet = instance)
    .then(() => TimeHolder.new(storage.address,'Deposits'))
    .then((instance) => timeHolder = instance)
    .then(() => ERC20DepositStorage.new(storage.address,'Deposits'))
    .then((instance) => erc20DepositStorage = instance)
    .then(() => ContractsManager.new(storage.address, "ContractsManager"))
    .then((instance) => contractsManager = instance)
    .then(() => UserManager.new(storage.address, 'UserManager'))
    .then((instance) => userManager = instance)
    .then(() => Roles2Library.new(storage.address, "Roles2Library"))
    .then((instance) => rolesLibrary = instance)
    .then(() => MultiEventsHistory.deployed())
    .then((instance) => multiEventsHistory = instance)
    .then(() => ERC20Manager.new(storage.address, "ERC20Manager"))
    .then((instance) => erc20Manager = instance)
    .then(() => PendingManager.new(storage.address, "PendingManager"))
    .then((instance) => pendingManager = instance)
    .then(() => Stub.deployed())
    .then((instance) => helperContract = instance)
    .then(async () => {
      secretLock = await helperContract.getHash(secret)
    })
    .then(() => FakeCoin2.deployed())
    .then((instance) => asset1 = instance)
    .then(() => FakeCoin3.deployed())
    .then((instance) => asset2 = instance)
    .then(() => FakeCoin.deployed())
    .then(function(instance) {
      shares = instance
      DEFAULT_SHARE_ADDRESS = instance.address;
      // init shares
      shares.mint(accounts[0], SHARES_BALANCE)
        .then(() => shares.mint(accounts[1], SHARES_BALANCE))
        .then(() => shares.mint(accounts[2], SHARES_BALANCE))
        // snapshot
        .then(() => reverter.snapshot(done))
        .catch(done);
    })
});

  // init(address _timeHolder, uint _closeIntervalDays) returns(bool)
  it('should receive the right ContractsManager contract address after init() call', () => {
    return defaultInit()
      .then(() => timeHolder.contractsManager.call())
      .then((address) => assert.equal(address, contractsManager.address) );
  });

  it("should have right wallet address", function () {
      return defaultInit()
      .then(() => timeHolder.wallet.call())
      .then(_wallet => assert.equal(timeHolderWallet.address, _wallet))
  })

  // depositFor(address _address, uint _amount) returns(bool)
  it('should return true if was called with 0 shares (copy from prev period)', () => {
    return defaultInit()
      .then(() => timeHolder.depositFor.call(DEFAULT_SHARE_ADDRESS, accounts[0], 0))
      .then((res) => assert.equal(res, ErrorsEnum.OK));
  });

  it('should not deposit if sharesContract.transferFrom() failed', () => {
    return defaultInit()
      .then(() => timeHolder.depositFor(DEFAULT_SHARE_ADDRESS, accounts[0], SHARES_BALANCE + 1))
      .then(() => assertSharesBalance(accounts[0], 1161))
      .then(() => assertDepositBalance(accounts[0], 0))
  });

  it('should be possible to deposit shares', () => {
    return defaultInit()
      .then(() => timeHolder.depositFor(DEFAULT_SHARE_ADDRESS, accounts[0], 100))
      .then(() => assertDepositBalance(accounts[0], 100))
  });

  it('should be possible to make deposit several times in one period', () => {
    return defaultInit()
      // 1st deposit
      .then(() => timeHolder.depositFor(DEFAULT_SHARE_ADDRESS, accounts[0], 100))
      .then(() => assertDepositBalance(accounts[0], 100))
      // 2nd deposit
      .then(() => timeHolder.depositFor(DEFAULT_SHARE_ADDRESS, accounts[0], 100))
      .then(() => assertDepositBalance(accounts[0], 200))
      // lock
      .then(() => timeHolder.lock(DEFAULT_SHARE_ADDRESS, 50, { from: accounts[0], }))
      .then(() => assertDepositBalance(accounts[0], 150))
      // 3rd deposit
      .then(() => timeHolder.depositFor(DEFAULT_SHARE_ADDRESS, accounts[1], 100))
      .then(() => assertDepositBalance(accounts[1], 100))
  });

  it('should not withdraw more shares than you have', () => {
    return defaultInit()
      .then(() => timeHolder.deposit(DEFAULT_SHARE_ADDRESS, 100))
      .then(() => timeHolder.withdrawShares.call(DEFAULT_SHARE_ADDRESS, 200))
      .then((res) => assert.notEqual(res, ErrorsEnum.OK))
      .then(() => timeHolder.withdrawShares(DEFAULT_SHARE_ADDRESS, 200))
      .then(() => assertDepositBalance(accounts[0], 100))
      .then(() => assertSharesBalance(accounts[0], SHARES_BALANCE - 100))
      .then(() => timeHolder.wallet.call())
      .then(_timeHolderWallet => assertSharesBalance(_timeHolderWallet, 100));
  });

  it('should allow to deposit shares', () => {
    return defaultInit()
      .then(() => timeHolder.deposit(DEFAULT_SHARE_ADDRESS, 100))
      .then(() => assertDepositBalance(accounts[0], 100))
  });

  it('should withdraw shares', () => {
    return defaultInit()
      .then(() => timeHolder.deposit(DEFAULT_SHARE_ADDRESS, 100))
      .then(() => timeHolder.withdrawShares(DEFAULT_SHARE_ADDRESS, 50))
      .then(() => assertDepositBalance(accounts[0], 50))
      .then(() => assertSharesBalance(accounts[0], SHARES_BALANCE - 50))
      .then(() => timeHolder.wallet.call())
      .then(_timeHolderWallet => assertSharesBalance(_timeHolderWallet, 50));
  });
});
