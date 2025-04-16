import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { AnimatedPreloader } from '../../components';
import { Loader } from '../../components/UserProfile/Info/InfoStyles';

import { translateField } from '../../shared/utils';

/**
 * Note: Компонент SortThroughImage - представляет собой компонент для отображения изображения с возможностью смены формата.
 *
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.images - Объект с данными изображения, включая путь, имя и текстовое описание.
 * @param {Function} props.onClick - Функция обработки клика на изображении.
 */

export const SortThroughImage = memo(({ images = { path: '/', name: 'logo', text: { key: 'logo' } }, onClick }) => {
  const api = useSelector((state) => state.api);
  const words = useSelector((state) => state.words);

  const [logoSrc, setLogoSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logoFormats = useMemo(() => ['webp', 'png', 'svg', 'jpg', 'gif'], []);

  /**
   * Асинхронная функция получения пути к изображению в доступных форматах.
   * @returns {Promise<string|null>} - Возвращает путь к изображению или null, если изображение не найдено в каком-либо формате.
   */

  const getLogoSource = useCallback(async () => {
    for (const format of logoFormats) {
      const imageUrl = `${images.path}${images.name}.${format}`;
      try {
        // Создаем новый объект Image и устанавливаем ему путь к изображению
        const image = new Image();
        image.src = imageUrl;

        // Создаем обещание, которое успешно разрешится при успешной загрузке изображения
        await new Promise((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject();
        });

        // Возвращаем путь к изображению, если изображение успешно загружено
        return imageUrl;
      } catch (error) {
        // Игнорируем ошибку и продолжаем проверку других форматов
      }
    }
    // Возвращаем null, если изображение не найдено ни в одном формате
    return null;
  }, [logoFormats, images.path, images.name]);

  useEffect(() => {
    /**
     * Асинхронная функция, которая вызывает getLogoSource и устанавливает результат в состояние компонента.
     */
    const fetchLogoSource = async () => {
      // Получаем путь к изображению с использованием getLogoSource
      const source = await getLogoSource();

      // Устанавливаем полученный путь в состояние компонента
      setLogoSrc(source);

      // Устанавливаем флаг isLoading в false, чтобы компонент мог корректно отобразить результат загрузки
      setIsLoading(false);
    };

    // Вызываем fetchLogoSource при монтировании компонента
    fetchLogoSource();
  }, [images.path, images.name, getLogoSource]);

  if (!api.loading && !isLoading) {
    // Если загрузка API завершена и изображение загружено, отображаем анимированный прелоадер
    return (
      <Loader className="sort-image">
        <AnimatedPreloader />
      </Loader>
    );
  }

  // Возвращаем разметку компонента с изображением или текстовым описанием, если изображение не найдено
  return (
    <Link to="/" onClick={onClick} className="sort-image">
      {logoSrc ? <img className="sort-image--image" src={logoSrc} alt="logo" /> : <span className="sort-image--text">{translateField(images.text.key, words)}</span>}
    </Link>
  );
});
