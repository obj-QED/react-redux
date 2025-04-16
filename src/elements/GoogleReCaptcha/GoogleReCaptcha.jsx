import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export const GoogleReCaptcha = memo(({ children }) => {
  const googleCaptcha = useSelector((state) => state.api.modules?.googleCaptcha);

  if (!googleCaptcha) {
    // eslint-disable-next-line no-console
    console.error('Google reCAPTCHA key is not available.');
    return null;
  }

  return <GoogleReCaptchaProvider reCaptchaKey={googleCaptcha}>{children}</GoogleReCaptchaProvider>;
});
