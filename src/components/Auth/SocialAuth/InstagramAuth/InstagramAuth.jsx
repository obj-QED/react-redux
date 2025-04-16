import React from 'react';
import { LoginSocialInstagram } from 'reactjs-social-login';
import { InstagramLoginButton } from 'react-social-login-buttons';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';

export const InstagramAuth = ({ setPreloader, isSignIn, authId }) => {
  const { handleResolve, handleReject } = useSocialAuth('instagram', setPreloader);
  return (
    <LoginSocialInstagram
      isOnlyGetToken
      client_id={authId?.id || ''}
      client_secret={authId.secret || ''}
      redirect_uri={process.env.REACT_APP_BASE_API || ''}
      onResolve={(data) => handleResolve(data, isSignIn)}
      onReject={handleReject}
    >
      <InstagramLoginButton text="" />
    </LoginSocialInstagram>
  );
};
