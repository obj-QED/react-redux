import { useEffect, useRef, useMemo } from 'preact/hooks';

// Создаем пользовательский хук useSkipInitialEffect
function useSkipInitialEffect(effect, deps) {
  // Создаем реф для отслеживания первого рендера компонента
  const initialRender = useRef(true);

  // Мемоизируем эффект с использованием useMemo
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoEffect = useMemo(() => effect, [deps]);

  // Используем useEffect для запуска эффекта, пропуская его при первом рендере
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      memoEffect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// Экспортируем созданный хук
export { useSkipInitialEffect };
