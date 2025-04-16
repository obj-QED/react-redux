import React, { useMemo, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import { useBrowserAndOSDetection } from '../../hooks/useBrowserAndOSDetection';
import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH } from '../../shared/imagePathes';

const platformData = {
  iOS: {
    id: 'ios',
    icon: 'apple.svg',
    alt: 'Apple',
  },
  Android: {
    id: 'android',
    icon: 'android.svg',
    alt: 'Android',
  },
  Windows: {
    id: 'windows',
    icon: 'windows.svg',
    alt: 'Windows',
  },
  // macOS: {
  //   id: 'ios',
  //   icon: 'apple.svg',
  //   text: 'macOS App',
  //   alt: 'macOS',
  // },
};

/**
 * Note: Компонент Download - представляет собой блок с кнопками загрузки приложения для различных платформ.
 *
 * @returns {JSX.Element|null} - Возвращает разметку компонента Download или null, если блок не должен отображаться.
 *
 */

export const Download = memo(() => {
  const words = useSelector((state) => state.words);
  const settings = useSelector((state) => state.settings);
  const { operatingSystem } = useBrowserAndOSDetection();

  const title = useMemo(() => translateField('download_title', words), [words]);
  const buttonText = useMemo(() => translateField('download_button', words), [words]);

  const platformInfo = useMemo(() => platformData[operatingSystem], [operatingSystem]);
  const appIcon = useMemo(() => (platformInfo?.id ? settings?.download?.icon : null), [platformInfo, settings]);
  const appLink = useMemo(() => (platformInfo?.id ? settings?.download?.platforms[platformInfo.id] : null), [platformInfo, settings]);

  const visible = useMemo(() => settings?.download?.enable && platformInfo && appLink, [settings, platformInfo, appLink]);

  const handleIconError = useCallback((e) => {
    e.target.onerror = null;
    e.target.remove();
  }, []);

  if (!visible) return null;

  const { icon } = platformInfo;

  return (
    <div className="download_wrapper">
      {!!appIcon && <img className="download_icon" alt="App" src={appIcon} onError={handleIconError} />}
      <div className="download_text">
        {title && <div className="download_title">{title}</div>}
        <div className="download_button">
          <a className="link" href={appLink} target="_blank" rel="noreferrer">
            <img src={`${UI_IMAGES_PATH}download/${icon}`} alt={operatingSystem} onError={handleIconError} />
            <span>{buttonText}</span>
          </a>
        </div>
      </div>
    </div>
  );
});
