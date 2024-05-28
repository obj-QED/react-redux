// eslint-disable-next-line
'use strict';

// Импортируем React и хук useEffect из Preact
import { useEffect } from 'react';

// Определяем пользовательский хук useOutsideClick
export const useOutsideClick = function useOutsideClick(ref, callback) {
  // Устанавливаем значение по умолчанию для параметра active
  let active = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

  // Определяем функцию handleClick для обработки события клика
  const handleClick = (e) => {
    // Проверяем, что ref существует и что клик был вне его области
    if (ref.current && !ref.current?.contains(e.target)) {
      // Вызываем колбэк, переданный в хук
      callback();
    }
  };

  // Используем эффект для добавления и удаления обработчика события клика
  useEffect(() => {
    // Добавляем обработчик, если active равен true
    active && document.addEventListener('click', handleClick);

    // Удаляем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
