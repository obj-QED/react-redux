// Импортируем необходимые хуки и функции из библиотек
import { useEffect } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { deviceDetect } from 'react-device-detect';
import { fetchData, getInfoRequest, getUserAgent, getWindowSize, getWords, getYourIpRequest, setAxiosError } from '../store/actions';
import { usePrevious } from './usePrevious';

// Создаем пользовательский хук useReduxView
export const useReduxView = () => {
  // Получаем доступ к диспетчеру Redux
  const dispatch = useDispatch();

  // Используем хук useLocation для получения текущего пути страницы
  const { pathname } = useLocation();

  // Получаем текущий язык из локального хранилища
  const currentLang = localStorage.getItem('current-lang');

  // Получаем информацию о первом посещении пользователя
  const isFirstVisit = localStorage.getItem('user-first-visit');

  // Используем хук usePrevious для получения предыдущего значения языка
  const prevLang = usePrevious(currentLang);

  // Получаем информацию об устройстве с помощью библиотеки react-device-detect
  const agentData = deviceDetect();

  // Получаем данные из Redux-стейта
  const data = useSelector((state) => state.api);
  const intervalUpdate = useSelector((state) => state.api?.intervalUpdate);
  const settings = useSelector((state) => state.settings);
  const activeProvider = useSelector((state) => state.handling.activeGameList);
  const words = useSelector((state) => state.words.server);
  const token = localStorage.getItem('user-token');

  // Эффект для обработки перезагрузки страницы
  useEffect(() => {
    if (performance.getEntriesByType('navigation')[0]) {
      if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
        localStorage.removeItem('last-game-open');
      }
    }
  }, []);

  // Эффект для обновления данных с заданной периодичностью
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (intervalUpdate && token) {
        dispatch(getInfoRequest());
        clearInterval(countdownInterval);
      }
    }, intervalUpdate * 1000);
  }, [token, intervalUpdate, dispatch]);

  // Эффект для обновления размеров окна и сохранения последнего выбранного провайдера
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

    window.addEventListener('DOMContentLoaded', updateDimensions());
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('DOMContentLoaded', updateDimensions());
      window.removeEventListener('resize', updateDimensions);
    };
  }, [activeProvider, dispatch, settings.rememberState]);

  // Эффект для обновления данных при изменении пути страницы
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

  // Эффект для обновления текущего языка и получения локализации слов
  const langLocalStorage = localStorage.getItem('current-lang');
  useEffect(() => {
    if (data && !words && data?.loading && !data?.loadingUpdateData) {
      dispatch(getWords(langLocalStorage ? langLocalStorage : data?.language));
    }
  }, [data, dispatch, words, langLocalStorage]);

  // Возвращаем результат, указывающий, что данные и слова доступны
  return !!(data && words);
};
