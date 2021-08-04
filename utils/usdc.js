const { BN } = require('@openzeppelin/test-helpers');

function usdc(n) {
  return new BN(n * 1e6);
}

module.exports = usdc;
