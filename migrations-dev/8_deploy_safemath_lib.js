const SafeMath = artifacts.require('SafeMath')
const StringsLib = artifacts.require('StringsLib')

module.exports = deployer => {
	deployer.then(async () => {
		await deployer.deploy(SafeMath)
		await deployer.deploy(StringsLib)
	})
}
