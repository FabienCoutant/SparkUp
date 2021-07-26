const TestUSDC = artifacts.require('TestUSDC');

module.exports = function (deployer) {
  deployer.deploy(TestUSDC);
};
