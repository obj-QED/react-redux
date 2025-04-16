import React from 'react';
import { LoginSocialFacebook } from 'reactjs-social-login';
import { FacebookLoginButton } from 'react-social-login-buttons';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';

export const FacebookAuth = ({ setPreloader, isSignIn, authId }) => {
  const { handleResolve, handleReject } = useSocialAuth('facebook', setPreloader);
  return (
    <LoginSocialFacebook isOnlyGetToken appId={authId?.id || ''} onResolve={(data) => handleResolve(data, isSignIn)} onReject={handleReject}>
      <FacebookLoginButton text={''} />
    </LoginSocialFacebook>
  );
};
