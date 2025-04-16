import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from './ButtonTypesStyles';

/**
 * Note: Компонент ButtonTypes - кастомная кнопка с различными стилями.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {string} props.styled - Стиль кнопки (rounded, square и т. д.).
 * @param {string} props.location - Расположение кнопки (left, right и т. д.).
 * @param {React.ReactNode} props.children - Внутреннее содержимое кнопки.
 * @param {function} props.onClick - Функция, вызываемая при клике на кнопку.
 * @param {string} props.className - Дополнительный класс для стилизации кнопки.
 * @param {boolean} props.disabled - Флаг, указывающий, является ли кнопка неактивной.
 * @returns {JSX.Element} - Возвращает разметку компонента ButtonTypes.
 */

export const ButtonTypes = memo(({ styled = 'rounded', location, children, onClick, className = '', disabled = false, ...props }) => {
  const buttonClass = useMemo(() => {
    return `btn btn--${styled} btn--${location} ${className}`;
  }, [styled, location, className]);

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick(e);
      }
    },
    [onClick],
  );

  return (
    <Button className={buttonClass} data-attr={location} onClick={handleClick} $styled={styled} disabled={disabled} {...props}>
      {children}
    </Button>
  );
});

ButtonTypes.propTypes = {
  styled: PropTypes.string,
  location: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

ButtonTypes.defaultProps = {
  styled: 'rounded',
  location: null,
  onClick: null,
  className: '',
  disabled: false,
};
