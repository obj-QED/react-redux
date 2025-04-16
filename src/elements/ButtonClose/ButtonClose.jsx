import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import ReactInlineSvg from 'react-inlinesvg';
import { getPopup } from '../../store/actions';
import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const closeIcon = `${UI_IMAGES_PATH}close.${UI_IMAGES_FORMAT}`;

/**
 * Note: Компонент ButtonClose - кнопка для закрытия.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.defaultIcon - Использовать ли иконку по умолчанию.
 * @param {function} props.onClick - Обработчик клика.
 * @param {ReactNode} props.children - Дочерние элементы.
 * @param {string} props.className - Дополнительные классы для кнопки.
 * @param {boolean} props.noImage - Не отображать изображение.
 * @param {boolean} props.onlychildren - Отображать только дочерние элементы.
 * @returns {JSX.Element} - Возвращает разметку компонента ButtonClose.
 */

export const ButtonClose = memo(({ defaultIcon, onClick, children, className, noImage, onlychildren }) => {
  const dispatch = useDispatch();
  const words = useSelector((state) => state.words);

  /**
   * Обработчик ошибки загрузки изображения.
   * @param {Event} e - Событие ошибки.
   */
  const handleImageError = useCallback((e) => {
    e.target.onerror = null;
    e.target.parentNode.removeChild(e.target);
  }, []);

  /**
   * Обработчик клика.
   */
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      dispatch(getPopup({ active: false, name: '' }));
    }
  }, [dispatch, onClick]);

  const buttonClass = useMemo(() => (className ? `button button-close ${className}` : 'button button-close'), [className]);

  return (
    <div className={buttonClass} onClick={handleClick}>
      {!onlychildren &&
        (defaultIcon ? (
          <ReactInlineSvg cacheRequests src={closeIcon} title={`close_${className}`} onError={handleImageError} width="24" />
        ) : (
          !noImage && <span className="no-image">{translateField('close', words)}</span>
        ))}
      {children}
    </div>
  );
});

ButtonClose.propTypes = {
  defaultIcon: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  noImage: PropTypes.bool,
  onlychildren: PropTypes.bool,
};

ButtonClose.defaultProps = {
  defaultIcon: true,
  className: '',
  noImage: false,
  onlychildren: false,
};

export default ButtonClose;
