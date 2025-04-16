import React, { useRef, useEffect } from 'react';
import ReactInlineSvg from 'react-inlinesvg';
import { useSocialAuth } from '../../../../hooks/useSocialAuth';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../../shared/imagePathes';

const imgSrc = `${SOCIAL_IMAGES_PATH}auth_telegram.${SOCIAL_IMAGES_FORMAT}`;

export const TelegramAuth = ({ setPreloader, isSignIn, authId }) => {
  const ref = useRef(null);
  const { handleResolve } = useSocialAuth('telegram', setPreloader);

  useEffect(() => {
    if (ref.current === null) return;

    window.TelegramLoginWidget = {
      dataOnauth: (user) => {
        const token = {
          data: {
            accessToken: user,
          },
        };
        handleResolve(token, isSignIn).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
        });
      },
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', authId?.id || '');
    script.setAttribute('data-size', 'small');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', false.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    ref.current.appendChild(script);
  }, [authId?.id, handleResolve, isSignIn, ref]);

  return (
    <div className="telegram-auth social-button">
      <ReactInlineSvg className="image" src={imgSrc} desciption="telegram" cacheRequests />
      <div className="telegram-auth-iframe" ref={ref} />
    </div>
  );
};
