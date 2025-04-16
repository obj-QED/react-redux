import React, { useEffect, useMemo, memo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { notification } from 'antd';
import { useLocation } from 'react-router-dom';
import { authClearError } from '../../store/actions';

export const Notification = memo(({ notificationData, errorResponse, duration = 4, style, getContainer = () => document.getElementById('notifications-block') }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [api, contextHolder] = notification.useNotification({
    placement: 'topRight',
    top: 70,
    duration,
    stack: {
      threshold: 4,
    },
    getContainer,
  });

  const dynamicApi = useMemo(() => {
    return new Proxy(api, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }
        return (args) => target.info({ ...args, type: prop });
      },
    });
  }, [api]);

  const shownNotifications = useRef(new Set());

  const hasNotification = useMemo(() => {
    return notificationData ? notificationData : [errorResponse];
  }, [notificationData, errorResponse]);

  useEffect(() => {
    hasNotification?.forEach((item, id) => {
      const uniqueKey = item?.id || id;
      if (!shownNotifications.current.has(uniqueKey)) {
        shownNotifications.current.add(uniqueKey);
        if (item?.isFirst === '1' || errorResponse) {
          const status = errorResponse ? 'error' : item?.status;
          dynamicApi[status]({
            style,
            key: uniqueKey,
            message: <div dangerouslySetInnerHTML={{ __html: item?.message }} />,
            duration,
            className: item?.className || (item?.status && `notification-general_${item?.status}`),
            icon: errorResponse?.icon || item?.icon ? <span dangerouslySetInnerHTML={{ __html: item?.icon }} /> : <></> || <></>,
            onClose: () => {
              if (location.pathname === '/auth') {
                dispatch(authClearError(undefined));
              }
            },
          });
        }
      }
    });
  }, [hasNotification, dynamicApi, duration, errorResponse, style, dispatch, location]);

  return <>{contextHolder}</>;
});
