import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setNotificationRead } from '../store/actions';

export const useNotification = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const notificationsList = useSelector((state) => state.notification?.notificationsUser);
  const notificationsListInPage = useSelector((state) => state.notification?.inPage?.list);
  const findUndreadNotifications = notificationsListInPage?.filter((item) => item.isRead === '0');
  const unreadAllNotifications = useSelector((state) => state.account?.data?.notificationCount);
  const unreadAllNotificationsCount = findUndreadNotifications?.length ?? unreadAllNotifications;

  const [actualNotificationsList, setActualNotificationsList] = useState([]);

  useEffect(() => {
    if (notificationsListInPage && location.pathname === '/notification') {
      setActualNotificationsList(notificationsListInPage);
    }
  }, [location.pathname, notificationsListInPage]);

  useEffect(() => {
    if (notificationsList && location.pathname !== '/notification') {
      setActualNotificationsList(notificationsList);
    }
  }, [location.pathname, notificationsList]);

  const handleReadNotification = useCallback(
    (id) => {
      setActualNotificationsList(actualNotificationsList.map((item) => (item.id === id ? { ...item, isRead: '1' } : item)));
      dispatch(setNotificationRead([Number(id)]));
    },
    [dispatch, actualNotificationsList],
  );

  const unreadNotificationsCount = useMemo(() => {
    return actualNotificationsList?.reduce((acc, item) => {
      if (item.isRead === '0') {
        acc[item.type] = (acc[item.type] || 0) + 1;
      }
      return acc;
    }, {});
  }, [actualNotificationsList]);

  const filteredNotificationsByType = useMemo(() => {
    return actualNotificationsList?.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {});
  }, [actualNotificationsList]);

  const lastThreeNotifications = useMemo(() => {
    if (actualNotificationsList && Array.isArray(actualNotificationsList)) {
      return actualNotificationsList.slice(0, 3);
    }
  }, [actualNotificationsList]);

  return { actualNotificationsList, unreadAllNotificationsCount, unreadNotificationsCount, lastThreeNotifications, handleReadNotification, filteredNotificationsByType };
};
