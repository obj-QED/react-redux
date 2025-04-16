import React, { Fragment, useState, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input as InputAntd } from 'antd';
import uuid from 'react-uuid';
import classNames from 'classnames';
import { setActiveInput } from '../../store/actions';

/**
 * Note: Компонент Input - представляет собой компонент ввода данных с поддержкой виртуальной клавиатуры.
 *
 * @param {Object} props - Свойства компонента.
 * @param {boolean} props.required - Флаг, указывающий, является ли поле обязательным для заполнения.
 * @param {string} props.type - Тип поля ввода (например, 'text', 'password').
 * @param {string} props.className - Дополнительные классы для стилизации компонента.
 * @param {string} props.placeholder - Значение атрибута placeholder для компонента ввода данных.
 * @param {Function} props.onChange - Функция обратного вызова при изменении значения в поле ввода.
 * @param {Function} props.onBlur - Функция обратного вызова при потере фокуса полем ввода.
 * @param {Function} props.onFocus - Функция обратного вызова при получении фокуса полем ввода.
 * @param {boolean} props.disabled - Флаг, указывающий, отключено ли поле ввода.
 * @param {string} props.name - Значение атрибута name для компонента ввода данных.
 * @param {string} props.autocomplete - Значение атрибута autocomplete для компонента ввода данных.
 * @param {string} props.theme - Тема оформления компонента (например, 'royal').
 * @param {string} props.label - Текстовая метка для компонента ввода данных.
 * @param {string} props.defaultValue - Значение по умолчанию для компонента ввода данных.
 * @param {Object} props.errors - Объект с ошибками валидации для компонента ввода данных.
 * @param {Object} props.register - Объект для регистрации компонента в контексте формы (React Hook Form).
 * @param {Object} props.validationSchema - Схема валидации для компонента ввода данных.
 * @param {boolean} props.handleHideLabel - Флаг, указывающий, нужно ли скрывать метку при фокусе на поле ввода.
 *
 */
export const Input = React.memo(
  ({
    required,
    type,
    className = '',
    placeholder,
    onChange,
    onBlur,
    onFocus,
    disabled,
    name,
    autocomplete = 'off',
    theme,
    label,
    defaultValue,
    errors,
    register,
    validationSchema,
    handleHideLabel = false,
  }) => {
    // Получаем диспетчер Redux
    const dispatch = useDispatch();

    // Создаем ref для доступа к компоненту input
    const ref = useRef();

    // Получаем данные из глобального состояния Redux с помощью useMemo для мемоизации
    const settings = useSelector((state) => state.settings);
    const handling = useSelector((state) => state.handling);

    // Генерируем уникальный идентификатор для компонента input
    const generateId = useMemo(() => uuid(), []);

    // Состояние для отображения/скрытия символов пароля
    const [inputFocused, setInputFocused] = useState(false);

    // Мемоизированные обработчики событий для предотвращения лишних перерисовок
    const handleChange = useCallback(
      (event) => {
        onChange?.(event);
        if (settings.virtualKeyboard && !handling.size.mobile) {
          window.VirtualKeyboard.setInput(event.target.value);
        }
      },
      [onChange, settings, handling],
    );

    const handleFocus = useCallback(
      (event) => {
        if (settings.virtualKeyboard && !handling.size.mobile) {
          dispatch(setActiveInput(generateId));
          window.VirtualKeyboard.setInput(event.target.value);
        }
        if (handleHideLabel) setInputFocused(true);
        onFocus?.(event);
      },
      [dispatch, generateId, settings, handling, handleHideLabel, onFocus],
    );

    const handleBlur = useCallback(() => {
      setInputFocused(false);
      onBlur?.();
    }, [onBlur]);

    // Возвращаем разметку компонента Input
    return register ? (
      <Fragment>
        {label && handleHideLabel && (
          <label
            className={classNames('label', {
              focus: inputFocused,
            })}
          >
            {label}
          </label>
        )}
        <InputAntd
          required={required}
          {...register(name, {
            validationSchema,
          })}
          name={name}
          defaultValue={defaultValue}
          ref={ref}
          id={generateId}
          key={type}
          className={classNames('input', className, {
            'input-royal': theme === 'royal',
          })}
          type={type}
          onChange={handleChange}
          autoComplete={autocomplete}
          disabled={disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={!settings.labelsForInputs ? placeholder : ''}
        />
        {errors && errors[name] && <span className="error">{errors[name].message}</span>}
      </Fragment>
    ) : (
      <Fragment>
        {settings.labelsForInputs && (
          <span
            className={classNames('label', {
              focus: inputFocused,
            })}
          >
            {placeholder}
          </span>
        )}
        <input
          required={required}
          defaultValue={defaultValue}
          name={name}
          ref={ref}
          id={generateId}
          key={type}
          className={classNames('input', className, {
            'input-royal': theme === 'royal',
          })}
          type={type}
          autoComplete={autocomplete}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={!settings.labelsForInputs ? placeholder : ''}
        />
      </Fragment>
    );
  },
);
