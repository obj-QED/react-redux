import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { AnimatedPreloader } from '../../components';
import { DefaultModal } from '../../elements';
import { translateField } from '../../shared/utils';
import { useNotification } from '../../hooks/useNotification';
import { MISC_IMAGES_PATH } from '../../shared/imagePathes';

const NotificationComponentModal = memo(() => {
  const location = useLocation();
  const { handleReadNotification, actualNotificationsList } = useNotification();

  const words = useSelector((state) => state.words);

  const size = useSelector((state) => state.handling.size);
  const pathname = location.pathname;

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [criticalNotifications, setCriticalNotifications] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasViewedAllNotifications, setHasViewedAllNotifications] = useState(false);

  useEffect(() => {
    if (actualNotificationsList) {
      const notifications = actualNotificationsList.filter((notification) => notification?.status === 'critical' && !Boolean(Number(notification?.isRead)));
      setCriticalNotifications(notifications);
      setIsDataLoaded(true);
    }
  }, [actualNotificationsList]);

  useEffect(() => {
    if (isDataLoaded && criticalNotifications.length > 0 && !hasViewedAllNotifications) {
      setIsModalOpen(true);
    }
  }, [isDataLoaded, criticalNotifications, hasViewedAllNotifications]);

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => setLoading(false), 1000);
    }
    return () => {
      setLoading(true);
      setImageLoaded(false);
    };
  }, [currentIndex, isModalOpen]);

  useEffect(() => {
    if (pathname) {
      setIsModalOpen(false);
      setHasViewedAllNotifications(false);
      setCurrentIndex(0);
      setLoading(true);
      setImageLoaded(false);
    }
  }, [pathname]);

  const handlePopupAction = useCallback(
    (action) => () => {
      const currentNotification = criticalNotifications[currentIndex];

      if (action.accept || action.close) {
        if (action.accept && currentNotification) {
          handleReadNotification(currentNotification.id);
        }

        if (currentIndex < criticalNotifications.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          setIsModalOpen(false);
          setHasViewedAllNotifications(true);
          setCurrentIndex(0);
        }
      }
    },
    [criticalNotifications, currentIndex, handleReadNotification],
  );

  const preloader = useMemo(
    () => (
      <div className="modal-notifications-criticals_preloader">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  const contentMessage = useMemo(() => {
    const currentNotification = criticalNotifications[currentIndex];

    return (
      <div
        className={classNames('modal-notifications-criticals_content', {
          loading: !imageLoaded,
        })}
        key={currentNotification?.id}
      >
        {!imageLoaded && preloader}
        <div className="square-image-container">
          <img
            className="square-image"
            src={`${MISC_IMAGES_PATH}notifications/critical_image_modal.webp`}
            alt="logo-form-otpCode"
            width="100%"
            height="100%"
            onLoad={(e) => {
              const element = e.target;
              const parentElement = element?.parentNode;
              if (parentElement) parentElement.style.display = 'block';
              setTimeout(() => setImageLoaded(true), 500);
            }}
            onError={(e) => {
              e.target.onerror = null;
              const element = e.target;
              const parentElement = element?.parentNode;
              if (parentElement) parentElement.style.display = 'none';
              setTimeout(() => setImageLoaded(true), 500);
            }}
          />
        </div>
        <div className="modal-notifications-criticals_content_title">
          <span>{translateField('notifications_critical_content_title', 'bonuses.button', words)}</span>
        </div>
        <div className="modal-notifications-criticals_content_list">
          <p dangerouslySetInnerHTML={{ __html: criticalNotifications[currentIndex]?.message || '' }} />
        </div>
      </div>
    );
  }, [criticalNotifications, currentIndex, words, preloader, imageLoaded]);

  const getContainer = useCallback(() => document.getElementById('notifications-block'), []);

  if (!isDataLoaded) return null;

  return (
    <>
      {isModalOpen && (
        <DefaultModal
          style={{ top: size.mobile ? 0 : 'auto' }}
          className={{ className: 'modal-notifications-criticals_dialog', classWrap: 'modal-notifications-criticals' }}
          loading={loading}
          modalTitle={translateField('notifications_critical_title', 'bonuses.button', words)}
          content={contentMessage}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          acceptHandling={handlePopupAction({ accept: true })}
          onCancel={handlePopupAction({ close: true })}
          getContainer={getContainer}
          params={{
            maskClosable: false,
            keyboard: false,
            destroyOnClose: true,
            centered: size.mobile ? false : true,
          }}
          closable={true}
          footer={[
            <Button key="btn-confirm" type="default" className="btn btn--confirm" onClick={handlePopupAction({ accept: true })}>
              {translateField('confirm', 'bonuses.button', words)}
            </Button>,
          ]}
        />
      )}
    </>
  );
});

export default NotificationComponentModal;
