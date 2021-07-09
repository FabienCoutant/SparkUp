import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import useEagerConnect from '../../hooks/useEagerConnect';
import useInactiveListener from '../../hooks/useInactiveListener';
import Notification from '../UI/Notification';

const Web3ReactManager = () => {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);
  const { error } = useWeb3React();

  function getErrorMessage(error: Error) {
    if (error instanceof NoEthereumProviderError) {
      return (
        <Notification message='No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.' />
      );
    } else if (error instanceof UnsupportedChainIdError) {
      return (
        <Notification message="You're connected to an unsupported network." />
      );
    } else if (error instanceof UserRejectedRequestErrorInjected) {
      return (
        <Notification message='Please authorize this website to access your Ethereum account.' />
      );
    } else {
      console.error(error);
      return (
        <Notification message='An unknown error occurred. Check the console for more details.' />
      );
    }
  }

  return <div>{error && getErrorMessage(error)} </div>;
};

export default Web3ReactManager;
