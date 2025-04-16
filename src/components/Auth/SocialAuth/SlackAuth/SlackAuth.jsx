import React, { useEffect } from 'react';
import { SlackLoginButton } from 'react-social-login-buttons';
import { useDispatch } from 'react-redux';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';
import { setActiveForm } from '../../../../store/actions';

export const SlackAuth = ({ setPreloader, authId }) => {
  const slackUrl = `https://slack.com/oauth/v2/authorize?client_id=${authId.id}&scope=&user_scope=identify`;
  const { handleResolve } = useSocialAuth('slack', setPreloader);
  const dispatch = useDispatch();
  const handleAuth = () => {
    window.location.href = slackUrl || '';
  };

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.search);
    const code = fragment.get('code');
    if (code) {
      const activeForm = localStorage.getItem('activeForm');
      const isSignIn = activeForm === 'login';
      if (!isSignIn) {
        dispatch(setActiveForm('registration'));
      }
      const token = {
        data: {
          accessToken: code,
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
      <SlackLoginButton text="" onClick={handleAuth} />
    </div>
  );
};
