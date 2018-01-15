const ChronoBankPlatform = artifacts.require('./ChronoBankPlatform.sol')
const PlatformsManager = artifacts.require('./PlatformsManager.sol')
const ERC20Manager = artifacts.require('./ERC20Manager.sol')
const ChronoBankAssetOwnershipManager = artifacts.require('./ChronoBankAssetOwnershipManager.sol')
const ERC20Interface = artifacts.require('./ERC20Interface.sol')
const AssetDonator = artifacts.require('./AssetDonator.sol')
const ContractsManager = artifacts.require('./ContractsManager.sol')

module.exports = async (deployer, network) => {
    if (network === 'rinkeby') {
        deployer.then(async () => {
            const TIME_SYMBOL = "TIME";

            await deployer.deploy(AssetDonator);
            let assetDonator = await AssetDonator.deployed();

            await assetDonator.init(ContractsManager.address);

            let erc20Manager = await ERC20Manager.deployed();
            let timeAddress = await erc20Manager.getTokenAddressBySymbol(TIME_SYMBOL);
            let time =  ERC20Interface.at(timeAddress);

            await time.transfer(AssetDonator.address, 1000000000000);

            console.log("[MIGRATION] [" + parseInt(require("path").basename(__filename)) + "] Asset donator setup: #done")
        });
    }
}
