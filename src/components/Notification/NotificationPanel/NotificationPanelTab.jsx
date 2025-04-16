import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';
import classNames from 'classnames';
import { useNotification } from '../../../hooks/useNotification';
import { translateField } from '../../../shared/utils';
import { setActiveTabNotification } from '../../../store/actions';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

export const NotificationPanelTab = ({ allMessages = false }) => {
  const dispatch = useDispatch();
  const { actualNotificationsList } = useNotification();
  const { activeTab, tabs } = useSelector((state) => state.notification?.inPage);
  const size = useSelector((state) => state.handling.size);
  const words = useSelector((state) => state.words);

  const countAll = useCallback(
    (tabKey) => {
      if (!actualNotificationsList) return 0;
      if (allMessages) {
        return actualNotificationsList?.length;
      }
      if (tabKey === 'all') return actualNotificationsList?.filter((msg) => msg?.keys?.includes(tabKey))?.length;
      else return actualNotificationsList?.filter((msg) => msg?.keys?.includes(tabKey))?.length;
    },
    [allMessages, actualNotificationsList],
  );

  const countUnread = useCallback(
    (tabKey) => {
      if (!actualNotificationsList) return 0;
      return actualNotificationsList.filter((msg) => msg?.keys?.includes(tabKey) && msg.isRead === '0')?.length;
    },
    [actualNotificationsList],
  );

  const filteredTabs = useMemo(() => {
    return allMessages ? tabs?.filter((tab) => tab?.key === 'all') : tabs;
  }, [tabs, allMessages]);

  const [iconSources, setIconSources] = useState(() => filteredTabs.map((tab) => `${UI_IMAGES_PATH}notifications/messages_${tab?.icon}.${UI_IMAGES_FORMAT}`));
  const [hasError, setHasError] = useState(() => filteredTabs.map(() => false));

  const handleError = (index) => {
    setIconSources((prev) => {
      const updated = [...prev];
      updated[index] = `${UI_IMAGES_PATH}notifications/messages_all.${UI_IMAGES_FORMAT}`;
      return updated;
    });
    setHasError((prev) => {
      const updated = [...prev];
      updated[index] = true;
      return updated;
    });
  };

  return (
    <div className="notification-panel-tab">
      {filteredTabs?.map((tab, index) => (
        <div
          key={index}
          onClick={() => dispatch(setActiveTabNotification(tab))}
          className={classNames('item', { 'item--active': tab?.key === activeTab?.key })}
          data-status={tab.key}
          data-undead={countUnread(tab?.key)}
          data-length={countAll(tab?.key)}
        >
          <div className="item__inner">
            {tab?.icon && !hasError[index] && (
              <div className="item__icon-wrapper">
                <ReactInlineSvg cacheRequests src={iconSources[index]} alt={tab?.key} onError={() => handleError(index)} />
              </div>
            )}
            {!size.mobile && <span className="item__label">{translateField(`message_${tab?.key}`, 'notification.list', words)}</span>}
            <span className="item__count">
              {countUnread(tab?.key)} / {countAll(tab?.key)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
