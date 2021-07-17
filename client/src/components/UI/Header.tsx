import { useWeb3React } from '@web3-react/core';
import { injected } from '../../connectors';
import { useAppDispatch } from '../../store/hooks';
import { uiActions } from '../../store/ui-slice';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useContractUSDC } from '../../hooks/useContract';

const Header = () => {
  const dispatch = useAppDispatch();
  const { account, chainId, active, error, activate } = useWeb3React();
  const [balanceUSDC, setBalanceUSDC] = useState('');
  const contractUSDC = useContractUSDC();

  useEffect(() => {
    const getBalance = async () => {
      const balance = await contractUSDC!.methods.balanceOf(account).call();
      const truncatedBalance = (parseInt(balance) / 1e6).toFixed(2);
      setBalanceUSDC(truncatedBalance);
    };
    if (chainId && chainId !== 1337) {
      getBalance();
    }
  }, [account, chainId, contractUSDC]);

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
    activate(
      injected,
      (error) =>
        dispatch(
          uiActions.setNotification({
            display: true,
            message: error.message,
            type: 'error',
          })
        ),
      false
    );
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-light'>
      <div className='container-fluid'>
        <Link to='/' style={{ textDecoration: 'none', color: 'white' }}>
          <div
            className='navbar-brand mb-0'
            style={{ color: 'white', fontSize: '30px' }}
          >
            SparkUp
          </div>
        </Link>
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
            {active && !error && (
              <>
                <li className='nav-item'>
                  <button type='button' className='btn btn-secondary'>
                    {chainId === 1 && 'Ethereum'}
                    {chainId === 3 && 'Ropsten'}
                    {(chainId === 1337 || chainId === 5777) && 'Ganache'}
                  </button>
                </li>
                <li className='nav-item'>
                  <button type='button' className='btn btn-secondary'>
                    {balanceUSDC} USDC
                  </button>
                </li>
                <li className='nav-item'>
                  <button type='button' className='btn btn-secondary'>
                    {account !== null &&
                      account !== undefined &&
                      truncateWalletAddress(account)}
                  </button>
                </li>
              </>
            )}
            {!active && (
              <li className='nav-item'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => tryActivation()}
                >
                  Connect
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
