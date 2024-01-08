// Импортируем хуки и функции из Preact и Redux
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationRead } from '../store/actions';

// Определяем пользовательский хук useNotification
export const useNotification = () => {
  // Получаем диспетчер и состояние уведомлений из хранилища Redux
  const dispatch = useDispatch();
  const notificationsList = useSelector((state) => state.api?.account?.notification);

  // Инициализируем состояние для актуального списка уведомлений
  const [actualNotificationsList, setActualNotificationsList] = useState(notificationsList);

  // Используем эффект для обновления актуального списка при изменении списка из хранилища
  useEffect(() => {
    notificationsList && setActualNotificationsList(notificationsList);
  }, [notificationsList, setActualNotificationsList]);

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
      return actualNotificationsList.slice(0, 3);
    }
  }, [actualNotificationsList]);

  // Возвращаем объект с актуальным списком уведомлений, последними тремя уведомлениями и колбэком для прочтения уведомления
  return { actualNotificationsList, lastThreeNotifications, handleReadNotification };
};
