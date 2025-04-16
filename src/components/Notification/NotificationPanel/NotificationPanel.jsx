import React, { useCallback, memo, useMemo } from 'react';
import { useSelector } from 'react-redux';

import ReactInlineSvg from 'react-inlinesvg';
import { useNavigate } from 'react-router-dom';

import { AnimatedPreloader } from '../../../components';
import { ButtonTypes } from '../../../elements';
import { translateField } from '../../../shared/utils';

import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';
import { NotificationPanelTab } from './NotificationPanelTab';
import { NotificationPanelView } from './NotificationPanelView';

const arrowLeft = `${UI_IMAGES_PATH}arrow-small-left.${UI_IMAGES_FORMAT}`;

export const NotificationPanel = memo(() => {
  const words = useSelector((state) => state.words);
  const loading = useSelector((state) => state.notification?.inPage?.loading);

  const preloader = useMemo(
    () => (
      <div className="notification-panel notification-panel_loading">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  const navigate = useNavigate();

  const handleBackHistory = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return loading ? (
    preloader
  ) : (
    <div className="notification-panel pages-layout">
      <div className="notification-panel__title-back-wrapper">
        <span className="notification-panel__title">{translateField('notification_title', 'notification', words)}</span>
        <div className="notification-panel__back-button-wrapper">
          <ButtonTypes
            styled="rounded"
            location={'back-history'}
            onClick={() => {
              handleBackHistory();
            }}
          >
            <ReactInlineSvg cacheRequests className="image arrow-left" src={arrowLeft} desciption="arrow" />
            <span>{translateField('back', 'notification', words, false)}</span>
          </ButtonTypes>
        </div>
      </div>
      <div className="notification-panel__sidebar-content-wrapper">
        <div className="notification-panel__sidebar-wrapper">
          <NotificationPanelTab allMessages={false} />
        </div>
        <div className="notification-panel__content-wrapper">
          <NotificationPanelView />
        </div>
      </div>
    </div>
  );
});
