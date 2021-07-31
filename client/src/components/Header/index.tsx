import {useWeb3React} from '@web3-react/core';
import {injected} from '../../connectors';
import {useAppDispatch} from '../../store/hooks';
import {notificationActions} from '../../store/Notification/slice';
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useContractUSDC} from '../../hooks/useContract';
import {NOTIFICATION_TYPE} from "../../constants";
import PlusSquareFill from '../../assets/images/PlusSquareFill'
import { serializeUSDCFor } from '../../utils/serializeValue'

const Header = () => {
    const dispatch = useAppDispatch();
    const {account, chainId, active, error, activate} = useWeb3React();
    const [balanceUSDC, setBalanceUSDC] = useState('0');
    const contractUSDC = useContractUSDC();

    useEffect(() => {
        const getBalance = async () => {
            const balance:number = await contractUSDC!.methods.balanceOf(account).call();
            const convert = serializeUSDCFor(balance,false).toString()
            setBalanceUSDC(convert);
        };
        if (chainId) {
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
                    notificationActions.setNotification({
                        message: error.message,
                        type: NOTIFICATION_TYPE.ERROR,
                    })
                ),
            false
        );
    };
    const renderCreateCampaign = () => {
        if (account) {
            return (
              <Link
                to='/create'
                style={{ textDecoration: 'none', color: 'white' }}
              >
                  <button type='button' className='btn btn-secondary gap-2'>
                      <PlusSquareFill />
                      <span className='align-middle'>Create Your Campaign</span>
                  </button>
              </Link>
            )
        } else {
            return
        }
    }
    return (
        <nav className='navbar navbar-expand-lg navbar-light'>
            <div className='container-fluid'>
                <Link to='/' style={{textDecoration: 'none', color: 'white'}}>
                    <div
                        className='navbar-brand mb-0'
                        style={{color: 'white', fontSize: '30px'}}
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
                    <span className='navbar-toggler-icon' />
                </button>

                <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                    <ul className='navbar-nav ms-auto mb-2 mb-lg-0 gap-3'>
                        {active && !error && (
                            <>
                                {renderCreateCampaign()}
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
