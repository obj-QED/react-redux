import { memo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';
import { ButtonsEl } from '../../elements';

import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

export const Cookies = memo(() => {
  const words = useSelector((state) => state.words);
  const cookiesSettings = useSelector((state) => state.settings.cookies) ?? true;

  const initialShowCookies = localStorage.getItem('close-cookies') !== 'false';
  const [showCookies, setShowCookies] = useState(initialShowCookies);

  const handleClose = useCallback(() => {
    localStorage.setItem('close-cookies', 'false');
    setShowCookies(false);
  }, []);

  if (!showCookies || !cookiesSettings) {
    return null;
  }

  return (
    <div className="cookies">
      <div className="container">
        <div className="cookies-window">
          <div className="content">
            <h2 className="title">
              {UI_IMAGES_FORMAT === 'svg' ? (
                <ReactInlineSvg cacheRequests title="cookies-icon" className="cookies-icon" src={`${UI_IMAGES_PATH}cookie.${UI_IMAGES_FORMAT}`} />
              ) : (
                <img
                  className="cookies-icon"
                  src={`${UI_IMAGES_PATH}cookie.${UI_IMAGES_FORMAT}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                  alt="cookies"
                />
              )}

              {translateField('cookies_title', words)}
            </h2>
            <p className="text" dangerouslySetInnerHTML={{ __html: translateField('cookies_text', words) }} />
          </div>
          <ButtonsEl className="cookies-button button--success" onClick={handleClose}>
            {translateField('accept', words)}
          </ButtonsEl>
        </div>
      </div>
    </div>
  );
});
