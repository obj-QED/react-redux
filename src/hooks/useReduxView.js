import { useEffect, useMemo, useState } from 'react'; // Импортируем useState
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deviceDetect } from 'react-device-detect';
import { fetchData, getInfoRequest, getUserAgent, getWindowSize, getWords, setAxiosError } from '../store/actions';
import { debounce } from '../shared/utils';

export const useReduxView = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const agentData = deviceDetect();
  const userAgent = agentData.userAgent || agentData.ua;
  const data = useSelector((state) => state.api);
  const apiLoading = data?.loading;
  const intervalUpdate = useSelector((state) => state.api?.intervalUpdate);
  const settings = useSelector((state) => state.settings);
  const activeProvider = useSelector((state) => state.handling.activeGameList);
  const words = useSelector((state) => state.words.server);
  const token = localStorage.getItem('user-token');

  // Флаг, указывающий, завершились ли все диспетчи
  const [dispatchesCompleted, setDispatchesCompleted] = useState(false);

  useEffect(() => {
    if (performance.getEntriesByType('navigation')?.[0]?.type === 'reload') {
      localStorage.removeItem('last-game-open');
    }
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (intervalUpdate && token) {
        dispatch(getInfoRequest());
      }
    }, intervalUpdate * 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [token, intervalUpdate, dispatch]);

  useEffect(() => {
    const updateDimensions = () => {
      settings.rememberState && localStorage.setItem('lastProvider', activeProvider);
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      dispatch(getWindowSize({ width: window.innerWidth, height: window.innerHeight }));
    };
    const devouncedUpdateDimensions = debounce(updateDimensions, 100);
    devouncedUpdateDimensions();
    window.addEventListener('resize', devouncedUpdateDimensions);

    return () => {
      window.removeEventListener('resize', devouncedUpdateDimensions);
    };
  }, [activeProvider, dispatch, settings.rememberState]);

  useEffect(() => {
    let page = pathname === '/' ? '/home' : pathname;

    const fetchAll = async () => {
      const promises = [dispatch(getUserAgent(userAgent)), !apiLoading ? dispatch(fetchData({ page })) : Promise.resolve()];

      return Promise.all(promises);
    };

    fetchAll()
      .catch((e) => {
        dispatch(setAxiosError(true));
      })
      .finally(() => {
        setDispatchesCompleted(true);
      });
  }, [dispatch, pathname, userAgent, apiLoading]);

  const langLocalStorage = localStorage.getItem('current-lang');
  const browserLang = (navigator.language || navigator.userLanguage).slice(0, 2);

  const choiceLang = useMemo(() => {
    if (langLocalStorage) return langLocalStorage;
    return (data?.languages?.includes(browserLang) && browserLang) || data.language;
  }, [langLocalStorage, browserLang, data?.languages, data.language]);

  useEffect(() => {
    if (data && !words && data?.loading && !data?.loadingUpdateData) {
      localStorage.setItem('current-lang', choiceLang);
      dispatch(getWords(choiceLang));
    }
  }, [data, dispatch, words, choiceLang, data?.languages]);

  // Возвращаем результат только если все диспетчи завершились
  return dispatchesCompleted ? !!(data && words) : false;
};
