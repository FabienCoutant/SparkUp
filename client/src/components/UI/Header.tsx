import React from 'react';
import { useWeb3React } from '@web3-react/core';

const Header = () => {
  const { account, chainId } = useWeb3React();

  // const chains = { 1: 'Etherum', 1337: 'Ganache' };

  const truncateWalletAddress = (
    address: string,
    startLength = 4,
    endLength = 4
  ): string => {
    return `${address.substring(0, startLength)}...${address.substring(
      address.length - endLength
    )}`;
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
          <ul className='navbar-nav ms-auto mb-2 mb-lg-0 gap-3'>
            {/* <li className='nav-item'>
              <button type='button' className='btn btn-secondary'>
                {chainId && chains.chainId}
              </button>
            </li> */}
            <li className='nav-item'>
              <button type='button' className='btn btn-secondary'>
                {chainId === 1 && 'Ethereum'}
                {chainId === 1337 && 'Ganache'}
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
        </div>
      </div>
    </nav>
  );
};

export default Header;
