import React, { useMemo, memo, useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../shared/imagePathes';
import classNames from 'classnames';

/**
 * Note: Компонент SocialIcons - представляет собой набор иконок социальных сетей с соответствующими ссылками.
 *
 * @returns {JSX.Element|null} - Возвращает разметку компонента SocialIcons или null, если отсутствуют социальные иконки.
 */
export const SocialIcons = memo(() => {
  // Получаем список социальных сетей из глобального состояния Redux
  const apiSocialNetworks = useSelector((state) => state?.api?.socialNetworks);
  const socialNetworks = useMemo(() => {
    if (apiSocialNetworks) {
      return apiSocialNetworks;
    } else {
      return {};
    }
  }, [apiSocialNetworks]);

  // Преобразуем объект социальных сетей в массив пар [name, url]
  const socialNetworksArray = useMemo(() => Object.entries(socialNetworks), [socialNetworks]);

  // Реф для хранения ссылок на изображения
  const imageRefs = useRef([]);
  // Массив для хранения состояний изображений
  const imageStates = useRef([]);

  // Состояние для отслеживания количества успешно загруженных изображений
  const [loadedCount, setLoadedCount] = useState(0);

  // Функция для обновления состояния изображения
  const updateImageState = (index, status) => {
    if (!imageStates.current[index]) {
      imageStates.current[index] = '';
    }
    imageStates.current[index] = status;

    if (status === 'loaded') {
      setLoadedCount((prevCount) => prevCount + 1);
    }
  };

  // Проверка всех изображений на загрузку

  /**
   * Функция отрисовки социальных иконок.
   * @returns {JSX.Element[]} - Возвращает массив элементов с социальными иконками и ссылками.
   */
  const renderSocialIcons = () => {
    return socialNetworksArray?.map(([name, url], index) => {
      if (url) {
        return (
          <a className="social-icons__link" href={url} target="_blank" rel="noreferrer" key={name}>
            <img
              ref={(el) => (imageRefs.current[index] = el)}
              src={`${SOCIAL_IMAGES_PATH}${name}.${SOCIAL_IMAGES_FORMAT}`}
              alt={name}
              onLoad={() => {
                updateImageState(index, 'loaded');
              }}
              onError={() => {
                updateImageState(index, 'error');
                if (imageRefs.current[index]) {
                  imageRefs.current[index].parentNode.remove();
                }
              }}
            />
          </a>
        );
      } else {
        return null;
      }
    });
  };

  // Проверяем, есть ли элементы в массиве социальных иконок
  const socialIcons = renderSocialIcons();

  // Если социальные иконки отсутствуют, возвращаем null
  if (Boolean(!socialIcons.length)) return null;

  // Определяем класс для родительского элемента

  // Возвращаем разметку компонента SocialIcons с социальными иконками
  return (
    <div
      className={classNames('social-icons', {
        hidden: loadedCount === 0 && socialNetworksArray.length > 0,
      })}
    >
      <div className="container">
        <div className="social-icons__content">{socialIcons}</div>
      </div>
    </div>
  );
});
