import { useEffect, useRef, useMemo } from 'preact/hooks';

function useSkipInitialEffect(effect, deps) {
  const initialRender = useRef(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoEffect = useMemo(() => effect, [deps]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      memoEffect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useSkipInitialEffect };
