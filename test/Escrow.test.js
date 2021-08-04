const { expectRevert } = require('@openzeppelin/test-helpers');
const usdc = require('../utils/usdc');
const { expect } = require('chai');
const TestUSDCContract = artifacts.require('TestUSDC.sol');
const EscrowContract = artifacts.require('Escrow');

contract('Escrow', (accounts) => {
  const [alice, bob, john] = accounts;
  let TestUSDCContractInstance;
  let EscrowContractInstance;

  beforeEach(async () => {
    TestUSDCContractInstance = await TestUSDCContract.new(john, { from: john });
    EscrowContractInstance = await EscrowContract.new(TestUSDCContractInstance.address, { from: alice });
    TestUSDCContractInstance.transfer(EscrowContractInstance.address, usdc('10000').toString(), { from: john });
  });
  describe('--- Transfer ---', async () => {
    it('should allow transfer from contract to address by owner', async () => {
      await EscrowContractInstance.transfer(bob, usdc('1000').toString(), { from: alice });
      const bobBalance = await TestUSDCContractInstance.balanceOf(bob);
      const escrowContractBalance = await EscrowContractInstance.getContractUSDCBalance();
      expect(bobBalance).to.be.bignumber.equal(usdc('1000'));
      expect(escrowContractBalance).to.be.bignumber.equal(usdc('9000'));
    });
    it('should revert if called by other than owner', async () => {
      await expectRevert(
        EscrowContractInstance.transfer(bob, usdc('1000').toString(), { from: bob }),
        'Ownable: caller is not the owner'
      );
    });
  });
  describe('--- Approve ---', async () => {
    it('should allow approve from contract to address by owner', async () => {
      await EscrowContractInstance.approve(bob, usdc('1000'), { from: alice });
      const bobAllowance = await EscrowContractInstance.allowance(EscrowContractInstance.address, bob);
      expect(bobAllowance).to.be.bignumber.equal(usdc('1000'));
    });
    it('should revert if called by other than owner', async () => {
      await expectRevert(
        EscrowContractInstance.approve(bob, usdc('1000'), { from: bob }),
        'Ownable: caller is not the owner'
      );
    });
  });
});
