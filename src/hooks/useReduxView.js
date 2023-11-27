import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deviceDetect } from 'react-device-detect';
import { fetchData, getInfoRequest, getUserAgent, getWindowSize, getWords, getYourIpRequest, setAxiosError } from '../store/actions';
import { usePrevious } from './usePrevious';

export const useReduxView = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const currentLang = localStorage.getItem('current-lang');
  const isFirstVisit = localStorage.getItem('user-first-visit');

  const prevLang = usePrevious(currentLang);

  const agentData = deviceDetect();

  const data = useSelector((state) => state.api);
  const intervalUpdate = useSelector((state) => state.api?.intervalUpdate);

  const settings = useSelector((state) => state.settings);
  const activeProvider = useSelector((state) => state.handling.activeGameList);
  const words = useSelector((state) => state.words.server);
  const token = localStorage.getItem('user-token');

  useEffect(() => {
    if (performance.getEntriesByType('navigation')[0]) {
      if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
        localStorage.removeItem('last-game-open');
      }
    }
  }, []);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (intervalUpdate && token) {
        dispatch(getInfoRequest());
        clearInterval(countdownInterval);
      }
    }, intervalUpdate * 1000);
  }, [token, intervalUpdate, dispatch]);

  useEffect(() => {
    function updateDimensions() {
      settings.rememberState && localStorage.setItem('lastProvider', activeProvider);
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      return dispatch(
        getWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        }),
      );
    }
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [activeProvider, dispatch, settings.rememberState]);

  useEffect(() => {
    let page = pathname === '/' ? '/home' : pathname;
    const pageBonuses = Boolean(pathname.includes('/bonuses/'));
    const fetchAll = async () => {
      await dispatch(getUserAgent(agentData.userAgent ? agentData.userAgent : agentData.ua));
      await dispatch(getYourIpRequest());
      if (!data.loading || (page === '/home' && (!Boolean(data.page.blocks.main?.length) || !Boolean(data.gamesList?.games?.length))) || pageBonuses)
        await dispatch(fetchData(page));
    };

    fetchAll()
      .then((res) => res)
      .catch((e) => {
        dispatch(setAxiosError(true));
        return;
      });
  }, [dispatch, pathname, agentData.userAgent, agentData.ua, isFirstVisit, data.loading, data.page.blocks.main]);

  useEffect(() => {
    data && localStorage.setItem('current-lang', data?.language);
    if (data && prevLang !== currentLang && !words) {
      dispatch(getWords(data?.language)); // Используем функцию из редукса
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, dispatch, currentLang, prevLang, words]);

  return !!(data && words);
};
