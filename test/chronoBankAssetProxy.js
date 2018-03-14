const ChronoBankPlatformTestable = artifacts.require('./ChronoBankPlatformTestable.sol');
const ChronoBankAsset = artifacts.require('./ChronoBankAsset.sol');
const ChronoBankAssetWithFee = artifacts.require('./ChronoBankAssetWithFee.sol');
const ChronoBankAssetProxy = artifacts.require('./ChronoBankAssetProxy.sol');
const Stub = artifacts.require('./Stub.sol');

const Reverter = require('./helpers/reverter');
const bytes32 = require('./helpers/bytes32');
const eventsHelper = require('./helpers/eventsHelper');
contract('ChronoBankAssetProxy', function(accounts) {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  const SYMBOL = 'LHT';
  const NAME = 'Test Name';
  const DESCRIPTION = 'Test Description';
  const VALUE = 1001;
  const BASE_UNIT = 2;
  const IS_REISSUABLE = true;
  let chronoBankPlatform;
  let chronoBankAsset;
  let chronoBankAssetWithFee;
  let chronoBankAssetProxy;
  let stub;

  const increaseTime = function(seconds) {
    return new Promise(function(resolve, reject) {
      try {
        web3.currentProvider.sendAsync({
          jsonrpc: '2.0',
          method: 'evm_increaseTime',
          id: new Date().getTime(),
          params: [seconds],
        }, (err, result) => {
          if (err) {
            return reject(err);
          }
          resolve(result);
        });
      } catch(err) {
        reject(err);
      }
    });
  };

  before('setup others', function(done) {
    Stub.deployed()
    .then(function(instance) {
      stub = instance;
      return ChronoBankAsset.new();
    }).then(function(instance) {
      chronoBankAsset = instance;
      return ChronoBankAssetProxy.new();
    }).then(function(instance) {
      chronoBankAssetProxy = instance;
      return ChronoBankPlatformTestable.new();
    }).then(function(instance) {
      chronoBankPlatform = instance;
      return chronoBankPlatform.setupEventsHistory(stub.address);
    }).then(function() {
      return chronoBankPlatform.issueAsset(SYMBOL, VALUE, NAME, DESCRIPTION, BASE_UNIT, IS_REISSUABLE);
    }).then(function() {
      return chronoBankAssetProxy.init(chronoBankPlatform.address, SYMBOL, NAME);
    }).then(function() {
      return chronoBankAssetProxy.proposeUpgrade(chronoBankAsset.address);
    }).then(function() {
      return chronoBankAsset.init(chronoBankAssetProxy.address);
    }).then(function() {
      reverter.snapshot(done);
    }).catch(done);
  });

  it('should be possible to upgrade asset implementation', function() {
    const sender = accounts[0];
    const receiver = accounts[1];
    var feeAddress = accounts[2];
    var feePercent = 1; // 0.01 * 100;
    const value1 = 100;
    const value2 = 200;
    const fee = 1;
    return chronoBankPlatform.setProxy(chronoBankAssetProxy.address, SYMBOL).then(function() {
      return chronoBankAssetProxy.transfer(receiver, value1);
    }).then(function() {
      return chronoBankAssetProxy.balanceOf(sender);
    }).then(function(result) {
      assert.equal(result.valueOf(), VALUE - value1);
      return chronoBankAssetProxy.balanceOf(receiver);
    }).then(function(result) {
      assert.equal(result.valueOf(), value1);
      return ChronoBankAssetWithFee.new();
    }).then(function(instance) {
      chronoBankAssetWithFee = instance;
      return chronoBankAssetWithFee.init(chronoBankAssetProxy.address);
    }).then(function() {
      return chronoBankAssetProxy.proposeUpgrade(chronoBankAssetWithFee.address);
    }).then(function() {
      return increaseTime(86400*3); // 3 days
    }).then(function() {
      return chronoBankAssetWithFee.setupFee(feeAddress, feePercent);
    }).then(function() {
      return chronoBankAssetProxy.commitUpgrade.call();
    }).then(function(result) {
      assert.isTrue(result);
      return chronoBankAssetProxy.commitUpgrade();
    }).then(function() {
      return chronoBankAssetProxy.transfer(receiver, value2);
    }).then(function() {
      return chronoBankAssetProxy.balanceOf(sender);
    }).then(function(result) {
      assert.equal(result.valueOf(), VALUE - value1 - value2 - fee);
      return chronoBankAssetProxy.balanceOf(receiver);
    }).then(function(result) {
      assert.equal(result.valueOf(), value1 + value2);
      return chronoBankAssetProxy.balanceOf(feeAddress);
    }).then(function(result) {
      assert.equal(result.valueOf(), fee);
    });
  });
});
