import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveForm, signInRequest, signUpRequest } from '../store/actions';

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
          const res = isSignIn ? await dispatch(signInRequest({ social: socialData, domain })) : await dispatch(signUpRequest({ social: socialData, domain }));

          // Перенаправляем на главную страницу при успешном получении токена
          if (res.content.token) {
            navigate('/');
          }

          // Если нет ошибок, переключаем форму на состояние 'success'
          if (!res.error) {
            dispatch(setActiveForm('success'));
          }
        } catch (error) {
          // Обрабатываем ошибку, если произошла
          // eslint-disable-next-line no-console
          console.error(error);
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
