import { useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLoginSubmit } from '../components/Auth/_events/useAuthSubmit';
import { translateField } from '../shared/utils';

export const useAutoLogin = () => {
  const dispatch = useDispatch();
  const handleSubmit = useLoginSubmit();

  const words = useSelector((state) => state.words);

  const isAutoLoginAttempted = useRef(false);

  const autoLogin = useCallback(async () => {
    if (isAutoLoginAttempted.current) {
      return { error: 'already_attempted' };
    }

    const searchParams = new URLSearchParams(window.location.search);
    const login = searchParams.get('l');
    const password = searchParams.get('p');

    if (!login || !password) {
      isAutoLoginAttempted.current = true;
      return { error: 'missing_credentials' };
    }

    isAutoLoginAttempted.current = true;
    const result = await handleSubmit({ login, password });

    if (result?.error) {
      dispatch({
        type: 'SHOW_NOTIFICATION',
        payload: {
          id: '0',
          isFirst: '1',
          isRead: '0',
          message: translateField(result?.error, words, false),
          status: 'alert',
          type: 'login',
          icon: '<svg stroke="currentColor" fill="#fff" stroke-width="0" viewBox="0 0 512 512" height="24px" width="24px" xmlns="http://www.w3.org/2000/svg"><path d="M417 80H137c-25.4 0-46 20.6-46 46 0 7.7 6.3 14 14 14s14-6.3 14-14c0-9.9 8.1-18 18-18h280c9.9 0 18 8.1 18 18v260c0 9.9-8.1 18-18 18H137c-9.9 0-18-8.1-18-18 0-7.7-6.3-14-14-14s-14 6.3-14 14c0 25.4 20.6 46 46 46h280c25.4 0 46-20.6 46-46V126c0-25.4-20.6-46-46-46z"></path><path d="M224 334.2c-5.4 5.4-5.4 14.3 0 19.8l.1.1c2.7 2.5 6.2 3.9 9.8 3.9 3.8 0 7.3-1.4 9.9-4.1l82.6-82.4c4.3-4.3 6.5-9.3 6.5-14.7 0-5.3-2.3-10.3-6.5-14.5l-84.6-84.4c-2.6-2.6-6.1-4.1-9.9-4.1-3.7 0-7.3 1.4-9.9 4.1-5.5 5.5-5.5 14.3 0 19.8l65.2 64.2H63c-7.7 0-14 6.3-14 14s6.3 14 14 14h224.6L224 334.2z"></path></svg>',
        },
      });
      return result;
    }

    if (result?.content?.token) {
      return { success: true };
    }
    return result;
  }, [handleSubmit, dispatch, words]);

  return autoLogin;
};
