import React, { Fragment, useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';
import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const closeIcon = `${UI_IMAGES_PATH}close.${UI_IMAGES_FORMAT}`;

export const A2hs = memo(({ bottom, onClose }) => {
  const words = useSelector((state) => state.words);
  const preloader = useSelector((state) => state.api.loadingUpdateData);
  const pwa = useSelector((state) => state.settings.pwa) ?? true;

  const [closeA2hsValue, setCloseA2hsValue] = useState(localStorage.getItem('close-a2hs') !== 'false');

  useEffect(() => {
    const storedValue = localStorage.getItem('close-a2hs');
    if (storedValue === null) {
      localStorage.setItem('close-a2hs', 'true');
      setCloseA2hsValue(true);
    } else {
      setCloseA2hsValue(storedValue !== 'false');
    }
  }, []);

  const handleClose = useCallback(() => {
    localStorage.setItem('close-a2hs', 'false');
    setCloseA2hsValue(false);
    if (onClose) onClose();
  }, [onClose]);

  const isChrome = useMemo(() => /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor), []);
  const isSafari = useMemo(() => /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent), []);

  if (!closeA2hsValue || (!isChrome && !isSafari) || pwa) {
    return null;
  }

  return (
    <Fragment>
      {!preloader && (
        <div className="a2hs" style={{ bottom }}>
          <div className="container">
            <div className="a2hs-window">
              {isChrome && (
                <div className="chrome">
                  <button className="a2hs-btn-icon" aria-label="Add">
                    +
                  </button>
                  <span className="text" dangerouslySetInnerHTML={{ __html: translateField('a2hs_text_chrome_mobile', words, false) }} />
                </div>
              )}
              {isSafari && (
                <div className="safari">
                  <p className="text" dangerouslySetInnerHTML={{ __html: translateField('a2hs_safari_mobile', words, false) }} />
                </div>
              )}
              <button className="a2hs-btn-close" onClick={handleClose} aria-label="Close">
                <ReactInlineSvg cacheRequests src={closeIcon} title="close-icon" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
});
