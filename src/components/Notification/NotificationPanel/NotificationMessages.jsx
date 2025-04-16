import React, { useMemo, Fragment, useRef, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Pagination } from 'antd';
import classNames from 'classnames';
import ReactInlineSvg from 'react-inlinesvg';

import { ErrorsMain, ButtonsEl } from '../../../elements';
import { useNotification } from '../../../hooks/useNotification';
import { translateField } from '../../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

const verifyIcon = `${UI_IMAGES_PATH}check-circle.${UI_IMAGES_FORMAT}`;

export const NotificationMessages = () => {
  const { handleReadNotification, actualNotificationsList } = useNotification();
  const refContent = useRef(null);
  const size = useSelector((state) => state.handling.size);
  const words = useSelector((state) => state.words);
  const { activeTab } = useSelector((state) => state.notification?.inPage);

  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const filteredNotifications = useMemo(() => {
    if (activeTab?.key === 'all') return actualNotificationsList;
    return actualNotificationsList?.filter((item) => item.keys?.includes(activeTab?.key));
  }, [actualNotificationsList, activeTab]);

  const totalRecordsLength = filteredNotifications?.length || 0;

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifications?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifications, currentPage]);

  const scrollToContent = useCallback(() => {
    if (refContent.current) {
      refContent.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(scrollToContent, 100);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  return (
    <Fragment>
      {currentItems && currentItems.length > 0 ? (
        <Fragment>
          <div className="system-messages" ref={refContent}>
            {currentItems.map((item) => (
              <div key={item.id} className="message" data-status={item.status} data-type={item.type}>
                <div className="message__inner">
                  <div className="message__content">
                    <div className="message__header">
                      <span className="message__title" dangerouslySetInnerHTML={{ __html: item.subject }} />
                    </div>
                    <div className="message__text" dangerouslySetInnerHTML={{ __html: item.message }} />
                    {item.isRead === '0' ? (
                      <span onClick={() => handleReadNotification(item.id)} className="message__status message__read">
                        {translateField('unread', 'basic', words)}
                      </span>
                    ) : (
                      <div className="message__status message__readed">
                        <span className="text">{translateField('readed', 'basic', words)}</span>
                        <ReactInlineSvg cacheRequests className="message__readed-icon" src={verifyIcon} description="message__readed-icon" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Pagination
            current={currentPage}
            total={totalRecordsLength}
            pageSize={itemsPerPage}
            onChange={handlePageChange}
            showSizeChanger={false}
            className="pagination"
            itemInputBg="red"
          />
        </Fragment>
      ) : (
        <ErrorsMain errorMessages={['notification_messages_not_found_to_view']} styled="inline" position="center" className="notification-panel_error" />
      )}
    </Fragment>
  );
};
