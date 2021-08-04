const { BN } = require('@openzeppelin/test-helpers/src/setup');
const { expect } = require('chai');

const TestUSDCContract = artifacts.require('TestUSDC');

contract('TestUSDC', (accounts) => {
  const [alice] = accounts;
  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(alice, { from: alice });
  });
  it('should return correct decimal', async () => {
    const decimals = await TestUSDCContractInstance.decimals();
    expect(decimals).to.be.bignumber.equal(new BN(6));
  });
});
