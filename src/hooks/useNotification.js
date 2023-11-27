import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationRead } from '../store/actions';

export const useNotification = () => {
  const dispatch = useDispatch();
  const notificationsList = useSelector((state) => state.api?.account?.notification);
  const [actualNotificationsList, setActualNotificationsList] = useState(notificationsList);

  useEffect(() => {
    notificationsList && setActualNotificationsList(notificationsList);
  }, [notificationsList, setActualNotificationsList]);

  const handleReadNotification = useCallback(
    (id) => {
      setActualNotificationsList(actualNotificationsList?.filter((item) => item.id !== id));
      dispatch(setNotificationRead([Number(id)]));
    },
    [dispatch, actualNotificationsList],
  );

  const lastThreeNotifications = useMemo(() => {
    if (actualNotificationsList && Array.isArray(actualNotificationsList)) {
      return actualNotificationsList.slice(0, 3);
    }
  }, [actualNotificationsList]);

  return { actualNotificationsList, lastThreeNotifications, handleReadNotification };
};
