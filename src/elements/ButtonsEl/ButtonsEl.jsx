import React, { memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../Spinner/Spinner';

/**
 * Note: Компонент ButtonsEl - кнопка с дополнительными возможностями (спиннер, состояние и т. д.).
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {string} props.type - Тип кнопки (например, 'button', 'submit' и т. д.).
 * @param {string} props.className - Дополнительный класс для стилизации кнопки.
 * @param {string} props.state - Состояние кнопки (например, 'active', 'inactive' и т. д.).
 * @param {boolean} props.loading - Флаг, указывающий, находится ли кнопка в состоянии загрузки.
 * @param {boolean} props.disabled - Флаг, указывающий, является ли кнопка неактивной.
 * @param {boolean} props.hidden - Флаг, указывающий, является ли кнопка скрытой.
 * @param {function} props.onClick - Функция, вызываемая при клике на кнопку.
 * @param {React.ReactNode} props.children - Внутреннее содержимое кнопки.
 * @returns {JSX.Element} - Возвращает разметку компонента ButtonsEl.
 */
export const ButtonsEl = memo(({ type, className, state, loading, disabled, hidden, onClick, children, label }) => {
  const classNames = useMemo(() => {
    let baseClass = 'button';
    if (className) {
      baseClass += ` ${className}`;
    }
    return baseClass;
  }, [className]);

  return (
    <button
      type={type}
      className={classNames}
      data-state={state}
      data-loading={loading}
      data-disabled={disabled}
      data-hidden={hidden}
      onClick={onClick}
      disabled={disabled}
      hidden={hidden}
      aria-label={label || typeof children === 'string' ? children : null}
    >
      <div className="button__loader-text-wrapper">
        {loading && (
          <div className="button__spinner-wrapper">
            <Spinner />
          </div>
        )}
        {children}
      </div>
    </button>
  );
});

ButtonsEl.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  state: PropTypes.string,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

ButtonsEl.defaultProps = {
  type: 'button',
  className: '',
  state: '',
  loading: false,
  disabled: false,
  hidden: false,
  onClick: null,
  children: null,
};
