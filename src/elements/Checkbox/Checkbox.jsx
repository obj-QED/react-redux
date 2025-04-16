import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import './Checkbox.scss';

/**
 * Note: Компонент CheckboxCustom - кастомный чекбокс.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.checked - Флаг, указывающий, выбран ли чекбокс.
 * @param {function} props.onChange - Функция, вызываемая при изменении состояния чекбокса.
 * @param {string} props.className - Дополнительный класс для стилизации чекбокса.
 * @param {Object} props.props - Дополнительные свойства для компонента Checkbox.
 * @returns {JSX.Element} - Возвращает разметку компонента CheckboxCustom.
 */
export const CheckboxCustom = memo(({ checked, onChange, className = '', ...props }) => {
  const handleChange = useCallback(
    (e) => {
      if (onChange) {
        onChange(e);
      }
    },
    [onChange],
  );

  return (
    <div className={`checkbox ${className}`}>
      <Checkbox checked={checked} id={props?.key} name={props?.key} onChange={handleChange} props={{ ...props }} />
    </div>
  );
});

CheckboxCustom.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  props: PropTypes.object,
};

CheckboxCustom.defaultProps = {
  checked: false,
  onChange: null,
  className: '',
  props: {},
};
