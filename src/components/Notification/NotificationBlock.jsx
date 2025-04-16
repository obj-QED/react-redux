import React, { useCallback, useRef, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { setOpenNotifications } from '../../store/actions';
import PortalContainer from '../../elements/PortalContainer/PortalContainer';

import { useNotification } from '../../hooks';
import { translateField } from '../../shared/utils';

export const useOutsideClick = function useOutsideClick(ref, callback, active = true) {
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !e.target.classList.contains('notification-modal__item-remove')) {
        callback();
      } else if (ref.current && ref.current.contains(e.target)) {
        e.stopPropagation();
      }
    };

    if (active) {
      document.addEventListener('click', handleClick);
    }

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [active, ref, callback]);
};

export const NotificationBlock = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const refNotification = useRef(null);

  const words = useSelector((state) => state.words);

  const handling = useSelector((state) => state.handling);

  const openNotifications = useSelector((state) => state.handling.openNotifications);
  const { actualNotificationsList, lastThreeNotifications, handleReadNotification } = useNotification();

  const handleNavigateNotifications = useCallback(() => {
    navigate('/notification');
    dispatch(setOpenNotifications(true));
  }, [navigate, dispatch]);

  useOutsideClick(refNotification, () => dispatch(setOpenNotifications(false)), openNotifications);

  useEffect(() => {
    return () => {
      dispatch(setOpenNotifications(false));
    };
  }, [dispatch]);

  return (
    <>
      {openNotifications && (
        <PortalContainer className="notification-modal" id="notification-modal" selector=".header__block" style={{ top: `${handling.header.height}px` }} ref={refNotification}>
          <div className="notification-modal__info-block">
            <span className="notification-modal__info-block-count">{actualNotificationsList?.length}</span>
            <span className="notification-modal__info-block-text">{translateField('notification_title', 'notification', words)}</span>
            <span className="notification-modal__info-block-link" onClick={handleNavigateNotifications}>
              {translateField('view_all', 'notification', words)}
            </span>
          </div>
          {actualNotificationsList?.length > 0 && (
            <div className="notification-modal__list">
              {lastThreeNotifications.map((item) => (
                <div key={item?.id} className="notification-modal__item">
                  <span className="notification-modal__item-text" dangerouslySetInnerHTML={{ __html: item?.message?.toString().replace(/_/g, ' ') }} />
                  <p className="notification-modal__item-remove" onClick={() => handleReadNotification(item.id)}>
                    Remove
                  </p>
                </div>
              ))}
            </div>
          )}
        </PortalContainer>
      )}
    </>
  );
});
