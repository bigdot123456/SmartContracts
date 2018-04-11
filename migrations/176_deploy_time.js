const MultiEventsHistory = artifacts.require("./MultiEventsHistory.sol")
const TimePlatform = artifacts.require("./TimePlatform.sol")
const TimeAsset = artifacts.require("./TimeAsset.sol")
const TimeAssetProxy = artifacts.require("./TimeAssetProxy.sol")
const TimePlatformEmitter = artifacts.require("./TimePlatformEmitter.sol")

module.exports = async (deployer, network) => {
    if (network !== "main") {
      deployer.then(async () => {
          const TIME_SYMBOL = 'TIME';
          const TIME_NAME = 'Time Token';
          const TIME_DESCRIPTION = 'ChronoBank Time Shares';
          const BASE_UNIT = 8;
          const IS_NOT_REISSUABLE = false;

          const history = await MultiEventsHistory.deployed();

          await deployer.deploy(TimePlatform);

          let timePlatform = await TimePlatform.deployed();

          //await history.authorize(timePlatform.address);
          await timePlatform.setupEventsHistory(timePlatform.address);

          await timePlatform.issueAsset(TIME_SYMBOL, 71011281080000, TIME_NAME, TIME_DESCRIPTION, BASE_UNIT, IS_NOT_REISSUABLE);

          await deployer.deploy(TimeAssetProxy);
          let proxy = await TimeAssetProxy.deployed();
          await proxy.init(timePlatform.address, TIME_SYMBOL, TIME_NAME);

          await deployer.deploy(TimeAsset);
          let asset = await TimeAsset.deployed();
          await asset.init(proxy.address);

          await timePlatform.setProxy(proxy.address, TIME_SYMBOL);
          await proxy.proposeUpgrade(asset.address);
          //await proxy.commitUpgrade();

          console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Oroginal Time deploy: #done")
      })
    }
}
