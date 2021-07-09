import Web3ReactManager from '../Web3/Web3ReactManager';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import { SUPPORTED_WALLETS } from '../../constants';
import { injected } from '../../utils/web3React';
const Header = () => {
  const { account, chainId, active, error, activate } = useWeb3React();

  const truncateWalletAddress = (
    address: string,
    startLength = 4,
    endLength = 4
  ): string => {
    return `${address.substring(0, startLength)}...${address.substring(
      address.length - endLength
    )}`;
  };

  const tryActivation = async () => {
    activate(injected, undefined, true);
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <div className='container-fluid'>
        <h2>SparkUp</h2>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          {active && !error && (
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0 gap-3'>
              <li className='nav-item'>
                <button type='button' className='btn btn-secondary'>
                  {chainId === 1 && 'Ethereum'}
                  {(chainId === 1337 || chainId === 5777) && 'Ganache'}
                </button>
              </li>
              <li className='nav-item'>
                <button type='button' className='btn btn-secondary'>
                  {account !== null &&
                    account !== undefined &&
                    truncateWalletAddress(account)}
                </button>
              </li>
            </ul>
          )}
          {!active && (
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0 gap-3'>
              <li className='nav-item'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => tryActivation()}
                >
                  Connect
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
