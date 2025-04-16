import React, { useEffect } from 'react';
import { DiscordLoginButton } from 'react-social-login-buttons';
import { useDispatch } from 'react-redux';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';
import { setActiveForm } from '../../../../store/actions';

export const DiscordAuth = ({ setPreloader, authId }) => {
  const { handleResolve } = useSocialAuth('discord', setPreloader);
  const dispatch = useDispatch();

  const handleAuth = () => {
    window.location.href = authId.url || '';
  };

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = fragment.get('access_token');
    if (accessToken) {
      const activeForm = localStorage.getItem('activeForm');
      const isSignIn = activeForm === 'login';
      if (!isSignIn) {
        dispatch(setActiveForm('registration'));
      }
      const token = {
        data: {
          accessToken,
        },
      };
      handleResolve(token, isSignIn).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
    }
  }, [dispatch, handleResolve]);

  return (
    <div>
      <DiscordLoginButton text="" onClick={handleAuth} />
    </div>
  );
};
