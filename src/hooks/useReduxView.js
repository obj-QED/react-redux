import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deviceDetect } from 'react-device-detect';
import { fetchData, getInfoRequest, getUserAgent, getWindowSize, getWords, setAxiosError } from '../store/actions';
import { debounce } from '../shared/utils';
import { useAutoLogin } from './autoLogin';

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
  const autoLogin = useAutoLogin();

  const [dispatchesCompleted, setDispatchesCompleted] = useState(false);

  const choiceLang = useMemo(() => {
    const langLocalStorage = localStorage.getItem('current-lang');
    const browserLang = (navigator.language || navigator.userLanguage).slice(0, 2);
    if (!langLocalStorage) localStorage.setItem('browser-lang', browserLang);
    return langLocalStorage || browserLang;
  }, []);

  useEffect(() => {
    if (performance.getEntriesByType('navigation')?.[0]?.type === 'reload') {
      localStorage.removeItem('last-game-open');
    }
  }, []);

  useEffect(() => {
    if (!intervalUpdate || !token) return;

    const countdownInterval = setInterval(() => {
      dispatch(getInfoRequest());
    }, intervalUpdate * 1000);

    return () => clearInterval(countdownInterval);
  }, [token, intervalUpdate, dispatch]);

  useEffect(() => {
    const updateDimensions = () => {
      if (settings.rememberState) {
        localStorage.setItem('lastProvider', activeProvider);
      }

      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      dispatch(getWindowSize({ width: window.innerWidth, height: window.innerHeight }));
    };

    const debouncedUpdateDimensions = debounce(updateDimensions, 100);
    debouncedUpdateDimensions();

    window.addEventListener('resize', debouncedUpdateDimensions);
    return () => window.removeEventListener('resize', debouncedUpdateDimensions);
  }, [activeProvider, dispatch, settings.rememberState]);

  useEffect(() => {
    const page = pathname === '/' ? '/home' : pathname;

    const loadInitialData = async () => {
      try {
        if (!apiLoading) {
          if (!token) {
            const autoLoginResult = await autoLogin();
            if (autoLoginResult?.error) {
              await Promise.resolve(dispatch(fetchData({ page })));
            }
          } else {
            await Promise.resolve(dispatch(fetchData({ page })));
          }
        }

        const languages = data?.languages || [];
        const selectedLang = languages.includes(choiceLang) ? choiceLang : languages[0];

        if (!words) {
          await Promise.resolve(dispatch(getWords(selectedLang)));
          await Promise.resolve(dispatch(getUserAgent(userAgent)));
        }
      } catch (error) {
        dispatch(setAxiosError(true));
      } finally {
        setDispatchesCompleted(true);
      }
    };

    loadInitialData();
  }, [dispatch, pathname, userAgent, apiLoading, choiceLang, words, data?.languages, autoLogin]);

  return dispatchesCompleted ? !!(data && words) : false;
};
