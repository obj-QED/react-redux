// Импортируем хуки из Preact
import { useEffect, useRef } from 'preact/hooks';

// Определяем пользовательский хук usePrevious
export const usePrevious = (value) => {
  // Создаем объект ref для хранения предыдущего значения
  const ref = useRef();

  // Используем эффект для обновления значения ref при изменении value
  useEffect(() => {
    ref.current = value;
  });

  // Возвращаем предыдущее значение
  return ref.current;
};
