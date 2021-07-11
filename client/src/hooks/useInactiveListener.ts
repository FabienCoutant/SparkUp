import { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from '../store/hooks';
import { uiActions } from '../store/ui-slice';

import { injected } from '../utils/web3React';

const useInactiveListener = (suppress: boolean = false) => {
  const { active, error, activate } = useWeb3React();
  const dispatch = useAppDispatch();

  useEffect((): any => {
    const { ethereum } = window as any;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
    if (!error) {
      dispatch(
        uiActions.setNotification({
          display: false,
          message: null,
          type: null,
        })
      );
    }
  }, [active, error, suppress, activate, dispatch]);
};

export default useInactiveListener;
