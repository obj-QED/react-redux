import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInRequestSocial, signUpRequestSocial, getInfoRequest, fetchData } from '../store/actions';

// Создаем пользовательский хук useSocialAuth
export const useSocialAuth = (provider, setPreloader) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const domain = window.location.hostname;

  // Создаем колбек для обработки успешного разрешения
  const handleResolve = useCallback(
    async ({ data }, isSignIn) => {
      if (data.accessToken || data.access_token) {
        if (setPreloader) setPreloader(true);

        const socialData = {
          provider,
          token: data.accessToken || data.access_token,
        };

        try {
          // Вызываем соответствующий запрос в зависимости от того, это вход или регистрация
          const res = isSignIn ? await dispatch(signInRequestSocial({ social: socialData, domain })) : await dispatch(signUpRequestSocial({ social: socialData, domain }));

          const error = res.error;
          const { token } = res.content;

          // Перенаправляем на главную страницу при успешном получении токена
          if (res.content.token) {
            localStorage.setItem('user-token', token);
            await dispatch(getInfoRequest());
            await dispatch({
              type: 'SET_CURRENT_USER_TOKEN',
              payload: token,
            });
            await dispatch(fetchData({ forceReloadGamesList: true }));
            await navigate('/');
          }

          if (error) {
            await dispatch({
              type: 'GET_FORM_MESSAGE',
              payload: error,
            });
            await dispatch({
              type: 'GET_FORM_MESSAGE_SOCIAL',
              payload: error,
            });
          }
        } catch (error) {
          dispatch({
            type: 'GET_FORM_MESSAGE',
            payload: error,
          });
          dispatch({
            type: 'GET_FORM_MESSAGE_SOCIAL',
            payload: error,
          });
        } finally {
          if (setPreloader) setPreloader(false);
        }
      }
    },
    [dispatch, domain, navigate, provider, setPreloader],
  );

  // Создаем колбек для обработки отказа
  const handleReject = useCallback((error) => {
    // Обрабатываем ошибку отказа
    // eslint-disable-next-line no-console
    console.error(error);
  }, []);

  // Возвращаем созданные колбеки для использования
  return { handleResolve, handleReject };
};
