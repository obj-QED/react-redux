import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

import {
  signInRequest,
  authPasswordReset,
  signUpRequest,
  setActivateAccount,
  signWhatsAppRequest,
  setActiveForm,
  fetchData,
  profileUpdateRequestAuth,
  profileUpdateRequest,
  getProfileUpdateRequest,
  authGetMessage,
} from '../../../store/actions';

const useLoginSubmit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settings);
  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'left')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'left')?.items;
  const menu = menu_local ? menu_local : menu_api;
  const menu_sport = menu?.find((item) => item.key === 'sport')?.items?.find((item) => item.key === 'sport')?.url;
  const afterAuthRedirect = settings?.afterAuthRedirect ?? false;
  const redirectUrl = afterAuthRedirect && menu_sport ? menu_sport : '/';

  const handleSubmit = useCallback(
    async (data) => {
      try {
        const domain = window.location.hostname;
        const setFromUrl = JSON.parse(localStorage.getItem('matching_params'));

        const additionalInfo = () => {
          const additionalData = {};
          if (setFromUrl && Array.isArray(setFromUrl)) {
            const objectsArray = setFromUrl.filter((item) => typeof item === 'object');
            const mergedObject = objectsArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
            additionalData.getFromUrl = mergedObject;
          }
          return additionalData;
        };

        const res = await dispatch(
          signInRequest({
            form: { ...data, phone: data?.phone?.replace(/[\.\-\(\)/\\\s]/g, ''), ...additionalInfo() },
            domain,
          }),
        );

        const content = res?.content;
        const error = res.error;
        const { token, activation, url } = content;

        if (error) {
          await dispatch({
            type: 'SIGNIN_ERROR',
            payload: error,
          });
        }

        if (!res.error && data.hasOwnProperty('phone')) {
          await dispatch({
            type: 'SIGNUP_PHONE_NUMBER',
            payload: data?.phone,
          });
        }

        if (url) {
          window.location.href = url;
        }

        if (activation || content.activation) {
          await dispatch(setActivateAccount(activation));
          await setTimeout(() => {
            dispatch(setActiveForm('success'));
          }, 1000);
        }

        if (token) {
          dispatch({ type: 'DELETE_NOTIFICATION', payload: '0' });

          localStorage.setItem('user-token', token);

          await dispatch(setActivateAccount('activation_login_token'));
          await dispatch(fetchData({ forceReloadGamesList: true }));

          localStorage.removeItem('promoCode');
          localStorage.removeItem('hideZeroBalance_Header');
          localStorage.removeItem('hideZeroBalance_Profile');
          localStorage.removeItem('matching_params');

          navigate(redirectUrl);
        }

        return res;
      } catch (error) {
        return { error: error.message || 'unknown_error' };
      }
    },
    [dispatch, navigate, redirectUrl],
  );

  return handleSubmit;
};

const useForgotSubmit = () => {
  const dispatch = useDispatch();

  const handleForgotSubmit = useCallback(
    async (data, previousData) => {
      try {
        // Преобразование данных: заменяем new_password на password
        const transformData = (data) => {
          if (!data) return data;
          const { new_password, ...rest } = data;
          return {
            ...rest,
            password: new_password || data.password, // Заменяем new_password на password
          };
        };

        // Создаем новый объект данных с заменой new_password на password
        const requestData = transformData({ ...previousData, ...data });

        // Отправляем запрос
        const res = await dispatch(
          authPasswordReset({
            data: requestData,
          }),
        );

        return { ...res, ...requestData };
      } catch (error) {
        return { error: error?.message || 'unknown_error' };
      }
    },
    [dispatch],
  );

  return handleForgotSubmit;
};

const useRegistrationSubmit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const setFromUrl = JSON.parse(localStorage.getItem('matching_params'));
  const googleCaptchaToken = JSON.parse(localStorage.getItem('googleCaptchaToken'));

  const settings = useSelector((state) => state.settings);
  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'left')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'left')?.items;
  const menu = menu_local ? menu_local : menu_api;
  const menu_sport = menu.find((item) => item.key === 'sport')?.items?.find((item) => item.key === 'sport')?.url;
  const afterAuthRedirect = settings?.afterAuthRedirect ?? false;
  const redirectUrl = afterAuthRedirect && menu_sport ? menu_sport : '/';

  const handleSubmit = useCallback(
    async (data) => {
      try {
        const domain = window.location.hostname;
        let recaptchaToken = '';

        const additionalInfo = () => {
          const additionalData = {};

          if (Boolean(googleCaptchaToken)) {
            const setRecaptchaToken = Boolean(googleCaptchaToken) && recaptchaToken ? recaptchaToken : '';
            additionalData.recaptchaToken = setRecaptchaToken;
          }

          if (setFromUrl && Array.isArray(setFromUrl)) {
            const objectsArray = setFromUrl.filter((item) => typeof item === 'object');
            const mergedObject = objectsArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
            additionalData.getFromUrl = mergedObject;
          }

          return additionalData;
        };

        if (Boolean(googleCaptchaToken)) {
          recaptchaToken = await executeRecaptcha('submit');
          if (!recaptchaToken) {
            return;
          }
        }

        const res = await dispatch(
          signUpRequest({
            form: { ...data, ...additionalInfo() },
            domain,
          }),
        );

        const content = res?.content;
        const error = res.error;
        const { token, activation } = content;

        if (data.hasOwnProperty('phone')) {
          dispatch({
            type: 'SIGNUP_PHONE_NUMBER',
            payload: data?.phone,
          });
        }

        if (error) {
          await dispatch({
            type: 'SIGNUP_ERROR',
            payload: error,
          });
        }

        if (token) {
          localStorage.setItem('user-token', token);

          localStorage.removeItem('hideZeroBalance_Header');
          localStorage.removeItem('hideZeroBalance_Profile');
          localStorage.removeItem('promoCode');
          localStorage.removeItem('matching_params');

          navigate(redirectUrl);
        } else if (activation) {
          await dispatch(setActivateAccount(activation));
          await setTimeout(() => {
            dispatch(setActiveForm('success'));
          }, 1000);

          localStorage.removeItem('hideZeroBalance_Header');
          localStorage.removeItem('hideZeroBalance_Profile');
          localStorage.removeItem('promoCode');
          localStorage.removeItem('matching_params');
        }

        return res;
      } catch (error) {
        return { error: error.message || 'registration_error' };
      }
    },
    [dispatch, setFromUrl, navigate, executeRecaptcha, googleCaptchaToken, redirectUrl],
  );

  return handleSubmit;
};

const useRegistrationSubmitStep = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const setFromUrl = JSON.parse(localStorage.getItem('matching_params'));
  const googleCaptchaToken = JSON.parse(localStorage.getItem('googleCaptchaToken'));

  const settings = useSelector((state) => state.settings);
  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'left')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'left')?.items;
  const menu = menu_local ? menu_local : menu_api;
  const menu_sport = menu.find((item) => item.key === 'sport')?.items?.find((item) => item.key === 'sport')?.url;
  const afterAuthRedirect = settings?.afterAuthRedirect ?? false;
  const redirectUrl = afterAuthRedirect && menu_sport ? menu_sport : '/';

  const handleSubmit = useCallback(
    async (data, previousData) => {
      try {
        const domain = window.location.hostname;
        let recaptchaToken = '';

        const additionalInfo = () => {
          const additionalData = {};

          if (Boolean(googleCaptchaToken)) {
            const setRecaptchaToken = Boolean(googleCaptchaToken) && recaptchaToken ? recaptchaToken : '';
            additionalData.recaptchaToken = setRecaptchaToken;
          }

          if (setFromUrl && Array.isArray(setFromUrl)) {
            const objectsArray = setFromUrl.filter((item) => typeof item === 'object');
            const mergedObject = objectsArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
            additionalData.getFromUrl = mergedObject;
          }

          return additionalData;
        };

        if (Boolean(googleCaptchaToken)) {
          recaptchaToken = await executeRecaptcha('submit');
          if (!recaptchaToken) {
            return;
          }
        }

        const transformData = (data) => {
          if (!data) return data;

          const transformedData = {};

          Object.keys(data).forEach((key) => {
            const value = data[key];

            // Skip adding the field if the value is undefined
            if (value !== undefined) {
              if (key === 'code') {
                transformedData.otpCode = value;
              } else if (key === 'new_password') {
                transformedData.password = value;
              } else {
                transformedData[key] = value;
              }
            }
          });

          return transformedData;
        };

        // Создаем новый объект данных с заменой otpCode на password
        const requestData = transformData({ ...previousData, ...data });

        const res = await dispatch(
          signUpRequest({
            form: { ...requestData, ...(requestData.hasOwnProperty('otpCode') && { ...additionalInfo() }) },
            domain,
          }),
        );

        const content = res?.content;
        const { token, activation, url } = content;

        if (token) {
          localStorage.removeItem('hideZeroBalance_Header');
          localStorage.removeItem('hideZeroBalance_Profile');
          localStorage.removeItem('promoCode');
          localStorage.removeItem('matching_params');

          navigate(redirectUrl);
        } else if (activation) {
          await dispatch(setActivateAccount(`activation_registration_step_${activation}`));
          await setTimeout(() => {
            dispatch(setActiveForm('success'));
          }, 1000);

          localStorage.removeItem('hideZeroBalance_Header');
          localStorage.removeItem('hideZeroBalance_Profile');
          localStorage.removeItem('promoCode');
          localStorage.removeItem('matching_params');
        } else if (url) {
          window.location.href = url;
        }

        return { ...res, ...requestData };
      } catch (error) {
        return { error: error.message || 'registration_error' };
      }
    },
    [dispatch, setFromUrl, navigate, executeRecaptcha, googleCaptchaToken, redirectUrl],
  );

  return handleSubmit;
};

const useWhatsAppRequest = ({ cmd }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settings);
  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'left')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'left')?.items;
  const menu = menu_local ? menu_local : menu_api;
  const menu_sport = menu.find((item) => item.key === 'sport')?.items?.find((item) => item.key === 'sport')?.url;
  const afterAuthRedirect = settings?.afterAuthRedirect ?? false;
  const redirectUrl = afterAuthRedirect && menu_sport ? menu_sport : '/';

  const handleWhatsAppSubmit = useCallback(
    async (data, previousData) => {
      try {
        const domain = window.location.hostname;
        const setFromUrl = JSON.parse(localStorage.getItem('matching_params'));

        const requestData = { ...previousData, ...data };
        const social = { network: 'whatsApp', ...requestData };

        const additionalInfo = () => {
          const additionalData = {};

          if (setFromUrl && Array.isArray(setFromUrl)) {
            const objectsArray = setFromUrl.filter((item) => typeof item === 'object');
            const mergedObject = objectsArray.reduce((acc, obj) => ({ ...acc, ...obj }), {});
            additionalData.getFromUrl = mergedObject;
          }

          return additionalData;
        };

        const res = await dispatch(
          signWhatsAppRequest({
            cmd: cmd,
            domain,
            social,
            ...(Object.keys(additionalInfo()).length > 0 && social.hasOwnProperty('code') && { info: additionalInfo() }),
          }),
        );

        const content = res?.content;
        const error = res.error;
        const { token, activation, url, message } = content;

        if (token) {
          localStorage.setItem('user-token', token);

          await dispatch(fetchData({ forceReloadGamesList: true }));
          await navigate(redirectUrl);
        } else if (activation) {
          await dispatch(setActivateAccount(activation));
          await setTimeout(() => {
            dispatch(setActiveForm('success'));
          }, 1000);
        } else if (url) {
          window.location.href = url;
        } else if (message) {
          await dispatch({
            type: 'SIGNIN_WHATSAPP_MESSAGE',
            payload: message,
          });
        }

        if (error) {
          await dispatch({
            type: 'SIGNIN_WHATSAPP_MESSAGE',
            payload: error,
          });
          await dispatch({
            type: 'WHATSAPP_ERROR',
            payload: error,
          });
        }

        return { ...res, ...requestData };
      } catch (error) {
        return { error: error?.message || 'unknown_error' };
      }
    },
    [dispatch, cmd, navigate, redirectUrl],
  );

  return handleWhatsAppSubmit;
};

const useRegistrationSubmitStepAccountUpdate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const settings = useSelector((state) => state.settings);
  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'left')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'left')?.items;
  const menu = menu_local ? menu_local : menu_api;
  const menu_sport = menu.find((item) => item.key === 'sport')?.items?.find((item) => item.key === 'sport')?.url;
  const afterAuthRedirect = settings?.afterAuthRedirect ?? false;
  const redirectUrl = afterAuthRedirect && menu_sport ? menu_sport : '/';

  const handleSubmit = useCallback(
    async (data, previousData) => {
      try {
        const requestData = { ...previousData, ...data };

        const res = await dispatch(
          profileUpdateRequestAuth({
            data: requestData,
          }),
        );

        const error = res.error;

        if (error) {
          await dispatch({
            type: 'SIGNUP_ERROR',
            payload: error,
          });
        }

        const { token } = res?.content;

        if (token) {
          localStorage.setItem('user-token', token);
          await navigate(redirectUrl);
        }

        return { ...res, ...requestData };
      } catch (error) {
        return { error: error.message || 'unknown_error' };
      }
    },
    [dispatch, navigate, redirectUrl],
  );

  return handleSubmit;
};

const useProfileUpdate = () => {
  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    async (data) => {
      try {
        const filteredData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== undefined || value !== null));
        const requestData = { ...filteredData };

        // Отправляем запрос
        const res = await dispatch(
          profileUpdateRequest({
            data: requestData,
          }),
        );

        const { content } = res;

        if (content?.length > 0) {
          await dispatch(authGetMessage('success'));
          await dispatch(getProfileUpdateRequest(content));
        }

        return res;
      } catch (error) {
        return { error: error.message || 'unknown_error' };
      }
    },
    [dispatch],
  );

  return handleSubmit;
};

export { useLoginSubmit, useForgotSubmit, useRegistrationSubmit, useWhatsAppRequest, useRegistrationSubmitStep, useRegistrationSubmitStepAccountUpdate, useProfileUpdate };
