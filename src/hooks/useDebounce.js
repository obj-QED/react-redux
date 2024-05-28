// Импортируем хуки из Preact
import { useState, useEffect } from 'react';

// Определяем пользовательский хук useDebounce
export const useDebounce = (value, delay) => {
  // Инициализируем состояние для хранения "затухшего" значения
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Используем эффект для обработки "затухания" значения при изменении исходного значения
  useEffect(() => {
    // Устанавливаем таймер, который изменит "затухшее" значение после задержки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при каждом изменении исходного значения
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Зависимости: исходное значение и задержка

  // Возвращаем текущее "затухшее" значение
  return debouncedValue;
};
