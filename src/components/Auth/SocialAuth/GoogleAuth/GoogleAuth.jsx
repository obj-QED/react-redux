import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';

export const GoogleAuth = ({ setPreloader, isSignIn, authId }) => {
  const { handleResolve, handleReject } = useSocialAuth('google', setPreloader);
  return (
    <LoginSocialGoogle client_id={authId?.id || ''} onResolve={(data) => handleResolve(data, isSignIn)} onReject={handleReject}>
      <GoogleLoginButton text={''} />
    </LoginSocialGoogle>
  );
};
