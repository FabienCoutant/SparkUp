import { useWeb3React } from '@web3-react/core';
import { notificationActions } from "../store/Notification/slice";
import { useAppDispatch } from '../store/hooks';
import { useEagerConnect } from './useWeb3';
import { useInactiveListener } from './useWeb3';
import {NOTIFICATION_TYPE} from "../constants";

const useInitWeb3 = () => {
  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const dispatch = useAppDispatch();
  const { error } = useWeb3React();

  if (error) {
    dispatch(
        notificationActions.setNotification({
        message: error.message,
        type: NOTIFICATION_TYPE.ERROR,
      })
    );
  }
};

export default useInitWeb3;
