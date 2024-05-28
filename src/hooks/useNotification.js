// Импортируем хуки и функции из Preact и Redux
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom';

import { setNotificationRead } from '../store/actions';

// Определяем пользовательский хук useNotification
export const useNotification = () => {
  // Получаем диспетчер и состояние уведомлений из хранилища Redux
  const dispatch = useDispatch();
  const location = useLocation();

  const notificationsList = useSelector((state) => state.api?.account?.notification);
  // const notificationsList = Array.from({ length: 20 }, (_, index) => ({
  //   id: index + 1,
  //   message: `message ${index + 1}`,
  // }));

  // Инициализируем состояние для актуального списка уведомлений
  const [actualNotificationsList, setActualNotificationsList] = useState(notificationsList);

  // Используем эффект для обновления актуального списка при изменении списка из хранилища
  useEffect(() => {
    if (notificationsList) setActualNotificationsList(notificationsList);
  }, [notificationsList, setActualNotificationsList, location.pathname]);

  // Определяем колбэк для обработки прочтения уведомления
  const handleReadNotification = useCallback(
    (id) => {
      // Фильтруем актуальный список, удаляя уведомление с указанным id
      setActualNotificationsList(actualNotificationsList?.filter((item) => item.id !== id));

      // Диспетчеризуем действие для пометки уведомления как прочтенного
      dispatch(setNotificationRead([Number(id)]));
    },
    [dispatch, actualNotificationsList],
  );

  // Вычисляем последние три уведомления из актуального списка
  const lastThreeNotifications = useMemo(() => {
    if (actualNotificationsList && Array.isArray(actualNotificationsList)) {
      return actualNotificationsList;
    }
  }, [actualNotificationsList]);

  // Возвращаем объект с актуальным списком уведомлений, последними тремя уведомлениями и колбэком для прочтения уведомления
  return { actualNotificationsList, lastThreeNotifications, handleReadNotification };
};
