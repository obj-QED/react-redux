// NotificationPanelView.js

import React from 'react';
import { NotificationMessages } from './NotificationMessages'; // Импортируем компонент SystemMessages

export const NotificationPanelView = () => {
  return (
    <div className="notification-panel-view">
      <NotificationMessages />
    </div>
  );
};
