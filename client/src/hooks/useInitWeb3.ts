import { useWeb3React } from '@web3-react/core';
import { uiActions } from '../store/ui-slice';
import { useAppDispatch } from '../store/hooks';
import { useEagerConnect } from './useWeb3';
import { useInactiveListener } from './useWeb3';

const useInitWeb3 = () => {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const dispatch = useAppDispatch();
  const { error } = useWeb3React();

  if (error) {
    dispatch(
      uiActions.setNotification({
        message: error.message,
        type: 'error',
      })
    );
  }
};

export default useInitWeb3;
