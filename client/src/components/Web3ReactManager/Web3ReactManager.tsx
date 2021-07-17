import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { network } from '../../connectors';
import { useEagerConnect, useInactiveListener } from '../../hooks/useWeb3';
import { useAppDispatch } from '../../store/hooks';
import { uiActions } from '../../store/ui-slice';
import Loader from '../UI/Loader';

export default function Web3ReactManager({
  children,
}: {
  children: JSX.Element;
}) {
  const { active } = useWeb3React();
  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React('NETWORK');
  const dispatch = useAppDispatch();

  // try to eagerly connect to an injected provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(network);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // when there's no account connected, react to logins (broadly speaking) on the injected provider, if it exists
  useInactiveListener(!triedEager);

  // handle delayed loader state
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoader(true);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // on page load, do nothing until we've tried to connect to the injected connector
  if (!triedEager) {
    return null;
  }

  // if the account context isn't active, and there's an error on the network context, it's an irrecoverable error
  if (!active && networkError) {
    dispatch(
      uiActions.setNotification({
        display: true,
        message: networkError.message,
        type: 'error',
      })
    );
  }

  // if neither context is active, spin
  if (!active && !networkActive) {
    return showLoader ? <Loader /> : null;
  }

  return children;
}