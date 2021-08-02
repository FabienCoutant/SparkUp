require('dotenv').config();
const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts/internal'),
  networks: {
    development: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
    },
    coverage: {
      host: '127.0.0.1', // Localhost (default: none)
      port: 8555, // Standard Ethereum port (default: none)
      network_id: '*', // Any network (default: none)
      disableConfirmationListener: true,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.PRIVATE_KEYS],
          `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`
        );
      },
      network_id: 3,
      timeoutBlocks: 200,
    },
    mainnet: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.PRIVATE_KEYS],
          `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`
        );
      },
      network_id: 1,
    },
  },
  mocha: {
    reporter: 'eth-gas-reporter',
    reporterOptions: {
      excludeContracts: ['Migrations'],
    },
    enableTimeouts: false,
  },
  compilers: {
    solc: {
      version: '0.8.6', // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {
        // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200,
        },
        //  evmVersion: "byzantium"
      },
    },
  },
  plugins: ['solidity-coverage'],
};
