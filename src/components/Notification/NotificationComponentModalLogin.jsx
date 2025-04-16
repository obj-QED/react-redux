import React, { memo, useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'antd';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { AnimatedPreloader } from '..';
import { DefaultModal } from '../../elements';
import { translateField } from '../../shared/utils';

const imagePath = '/uploads/';

const NotificationComponentModalLogin = memo(({ type = 'login' }) => {
  const words = useSelector((state) => state.words);
  const size = useSelector((state) => state.handling.size);
  const location = useLocation();
  const settings = useSelector((state) => state.settings);
  const enableComponent = useMemo(() => {
    if (type === 'login') {
      return settings?.notificationLoginModal ?? false;
    } else if (type === 'unlogin') {
      return settings?.notificationUnloginModal ?? false;
    }
    return false;
  }, [type, settings?.notificationLoginModal, settings?.notificationUnloginModal]);

  const notificationLink = useMemo(() => {
    if (type === 'login') {
      return settings?.notificationLoginLink;
    } else if (type === 'unlogin') {
      return settings?.notificationUnloginLink;
    }
    return null;
  }, [type, settings?.notificationLoginLink, settings?.notificationUnloginLink]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginModal = localStorage.getItem(`check-${type}-modal`);
    const token = localStorage.getItem('user-token');

    if (type === 'login') {
      if (token && !checkLoginModal) {
        setIsModalOpen(true);
        setLoading(false);
      }
    } else if (type === 'unlogin') {
      if (!token && !checkLoginModal) {
        setIsModalOpen(true);
        setLoading(false);
      }
    }
  }, [type]);

  useEffect(() => {
    const checkLoginModal = localStorage.getItem(`check-${type}-modal`);
    const token = localStorage.getItem('user-token');

    if (type === 'login') {
      if (token && !checkLoginModal) {
        setIsModalOpen(true);
        setLoading(false);
      }
    } else if (type === 'unlogin') {
      if (!token && !checkLoginModal) {
        setIsModalOpen(true);
        setLoading(false);
      }
    }
  }, [location.pathname, type]);

  const handlePopupAction = useCallback(
    (action) => () => {
      if (action.accept) {
        localStorage.setItem(`check-${type}-modal`, 'true');
      }
      setIsModalOpen(false);
    },
    [type],
  );

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const preloader = useMemo(
    () => (
      <div className="modal-notifications-criticals_preloader">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  const contentMessage = useMemo(() => {
    return (
      <div
        className={classNames('modal-notifications-criticals_content', {
          loading: !imageLoaded,
        })}
        key={localStorage.getItem(`check-${type}-modal`)}
      >
        {!imageLoaded && preloader}
        <div className="square-image-container">
          <img
            className="square-image"
            src={`${imagePath}notifications/${type}_image_modal.webp`}
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
        <div className="modal-notifications-criticals_content_list">
          <p style={{ textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: translateField(`notifications_${type}_content_message`, 'bonuses.button', words) }} />
        </div>
      </div>
    );
  }, [words, preloader, imageLoaded, type]);

  const getContainer = useCallback(() => document.getElementById('notifications-block'), []);

  if (!enableComponent) return null;

  return (
    <>
      {isModalOpen && (
        <DefaultModal
          style={{ top: size.mobile ? 0 : 'auto' }}
          className={{ className: 'modal-notifications-criticals_dialog', classWrap: 'modal-notifications-criticals' }}
          loading={loading}
          modalTitle={translateField(`notifications_${type}_title`, 'bonuses.button', words)}
          content={contentMessage}
          isModalOpen={isModalOpen}
          setIsModalOpen={handleClose}
          acceptHandling={handlePopupAction({ accept: true })}
          onCancel={handleClose}
          getContainer={getContainer}
          params={{
            maskClosable: true,
            keyboard: false,
            destroyOnClose: true,
            centered: true,
          }}
          closable={true}
          footer={[
            <Button key="btn-confirm" type="default" className="btn btn--confirm" onClick={handlePopupAction({ accept: true })}>
              <a href={notificationLink?.link} target={notificationLink?.target ?? '_blank'} rel="noopener noreferrer">
                {translateField(notificationLink?.key ?? `notifications_${type}_content_link`, 'bonuses.button', words, false)}
              </a>
            </Button>,
          ]}
        />
      )}
    </>
  );
});

export default NotificationComponentModalLogin;
