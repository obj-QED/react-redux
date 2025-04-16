import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import InputMask from 'react-input-mask';
import { Controller } from 'react-hook-form';
import { Checkbox, DatePicker, Input, Select, Radio } from 'antd';
import { PhoneInput } from 'react-international-phone';

import locale from 'antd/es/date-picker/locale/en_US';

import { translateField } from '../../shared/utils';
import { MISC_IMAGES_PATH } from '../../shared/imagePathes';

import { Error } from './ControllerFormStyles';

import './ControllerForm.scss';

/**
 * Note: Компонент ControllerForm - форма управления контроллерами для различных типов полей.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {string} props.name - Имя поля.
 * @param {string} props.placeholder - Заглушка для поля ввода.
 * @param {string} props.fieldType - Тип поля (input, inputPassword, checkbox, datePicker, select, phoneInput).
 * @param {Object} props.errors - Объект с ошибками формы.
 * @param {boolean} props.withoutSelectOption - Флаг, указывающий, нужно ли отображать опции для поля select.
 * @param {Object} props.control - Контроллер формы.
 * @param {string} props.className - Класс для контейнера формы.
 * @param {string} props.classNameInput - Класс для поля ввода.
 * @param {string} props.defaultCountry - Страна по умолчанию для поля phoneInput.
 * @param {string} props.defaultValue - Значение по умолчанию для поля ввода.
 * @param {boolean} props.disabled - Флаг, указывающий, нужно ли отключить поле ввода.
 * @param {Array} props.selectOptions - Опции для поля select.
 * @param {boolean} props.forceDialCode - Флаг, указывающий, нужно ли принудительно отображать код страны для поля phoneInput.
 * @param {React.Element} props.dialCodePreview - Предварительный просмотр кода страны для поля phoneInput.
 * @param {boolean} props.disableDialCodeAndPrefix - Флаг, указывающий, нужно ли отключить код страны и префикс для поля phoneInput.
 * @param {boolean} props.showDisabledDialCodeAndPrefix - Флаг, указывающий, нужно ли отображать отключенный код страны и префикс для поля phoneInput.
 * @param {Object} props.words - Словарь слов для перевода.
 * @param {boolean} props.picker - Флаг, указывающий, нужно ли использовать выбор даты.
 * @param {string} props.format - Формат даты для поля datePicker.
 * @param {React.Element} props.children - Дочерние элементы формы.
 * @param {boolean} props.required - Флаг, указывающий, что поле обязательно для заполнения.
 * @param {boolean} props.signUpError - Флаг, указывающий, что произошла ошибка при регистрации.
 * @param {boolean} props.showNow - Флаг, указывающий, нужно ли отображать сегодняшнюю дату для поля datePicker.
 * @param {function} props.disabledDate - Функция, возвращающая true для отключения конкретных дат для поля datePicker.
 * @param {string} props.label - Метка для поля datePicker.
 * @param {boolean} props.showSearch - Флаг, указывающий, нужно ли отображать поиск для поля select.
 * @param {string} props.optionFilterProp - Свойство, используемое для фильтрации опций для поля select.
 * @param {function} props.filterOption - Функция для фильтрации опций для поля select.
 * @param {boolean} props.filterSort - Флаг, указывающий, нужно ли сортировать отфильтрованные опции для поля select.
 * @returns {JSX.Element} - Возвращает разметку компонента ControllerForm.
 */
export const ControllerForm = ({
  id,
  name,
  placeholder,
  dropdownStyle,
  fieldType = 'input',
  errors,
  withoutSelectOption = false,
  control,
  className,
  classNameInput,
  defaultCountry,
  defaultValue,
  disabled,
  selectOptions,
  forceDialCode,
  dialCodePreview,
  disableDialCodeAndPrefix,
  showDisabledDialCodeAndPrefix,
  words,
  picker,
  format,
  children,
  required = false,
  holderMask,
  signUpError,
  showNow,
  disabledDate,
  label,
  showSearch,
  optionFilterProp,
  filterOption,
  filterSort,
  autoComplete,
  type,
  placement,
  onFocus,
  maxLength,
  inputReadOnly,
}) => {
  const settings = useSelector((state) => state.settings);
  const translate = useSelector((state) => state.words);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const handleDropdownVisibleChange = (visible) => {
    setDropdownVisible(visible);
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const documentEl = document.querySelector('#root .view');

    const preventDefault = (e) => {
      e.preventDefault();
    };

    if (dropdownVisible && dropdownRef.current) {
      // Прокрутка дропдауна в центр экрана
      dropdownRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Прокрутка так, чтобы элемент был по центру
      });

      // Блокировка прокрутки у класса documentEl
      documentEl.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventDefault, { passive: false });
    } else {
      // Восстановление прокрутки у body
      documentEl.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault);
    }

    return () => {
      // Восстановление прокрутки при размонтировании
      documentEl.style.overflow = '';
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [dropdownVisible]);

  const getVariableMask = (item) => {
    switch (item) {
      case 'sol_webpay':
        return { mask: '99.999.999-9' };
      case 'ars_cuit':
        return { mask: '99.999.999' };
      case 'pix':
        if (filterOption === 'pix_dash') return { mask: '999.999.999-99', holder: 'XXX.XXX.XXX-XX' };
        return { mask: '999.999.999.99', holder: 'XXX.XXX.XXX.XX' };
      case 'mastercard':
        return { mask: '9999 9999 9999 9999', holder: 'XXXX XXXXX XXXX XXXXX' };
      case 'visa':
        return { mask: '9999 9999 9999 9999', holder: 'XXXX XXXXX XXXX XXXXX' };
      case 'card_expiry':
        return {
          mask: '99/9999',
          holder: 'MM/YYYY',
        };
      default:
        return {
          mask: '9999 9999 9999 9999',
          holder: item,
        };
    }
  };

  const hasField = {
    input_mask: (field) => {
      const { mask } = getVariableMask(holderMask);
      const maxLength = mask.length;

      return (
        <InputMask mask={mask} placeholder={placeholder} maskChar={null} value={field.value ?? defaultValue} onChange={field.onChange}>
          {(inputProps) => <Input name={name} {...inputProps} id={id} autoComplete={autoComplete} className={classNameInput} maxLength={maxLength} />}
        </InputMask>
      );
    },
    input: (field) => {
      return (
        <Input
          id={id}
          autoComplete={autoComplete}
          disabled={disabled}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={classNameInput}
          type={type}
          onFocus={onFocus}
          maxLength={maxLength}
          {...field}
        />
      );
    },
    inputPassword: (field) => (
      <Input.Password
        id={id}
        autoComplete={autoComplete}
        disabled={disabled}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onFocus={onFocus}
        className={classNameInput}
        {...field}
      />
    ),

    checkbox: (field) => (
      <section>
        <Checkbox
          disabled={disabled}
          placeholder={placeholder}
          checked={field?.value}
          onChange={(e) => {
            field?.onChange(e.target.checked);
          }}
        />
        I am currently working in this role
      </section>
    ),
    datePicker: (field) => (
      <DatePicker
        disabled={disabled}
        placeholder={placeholder}
        className={classNameInput}
        picker={picker}
        defaultValue={defaultValue}
        format={format}
        showNow={showNow}
        disabledDate={disabledDate}
        label={label}
        onChange={(value) => {
          field?.onChange(value);
        }}
        locale={locale}
        autoComplete="off"
        onFocus={onFocus}
        id={name}
        inputReadOnly={inputReadOnly}
      />
    ),
    radio: (field) => {
      return (
        <Radio.Group
          id={id}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => field?.onChange(e.target.value)}
          value={field?.value === '' ? placeholder : field?.value}
          className={classNameInput}
          onFocus={onFocus}
        >
          {selectOptions?.map((item, id) => {
            return (
              <Radio.Button key={id} value={item.value}>
                <img
                  className="ant-radio-image"
                  src={item?.image}
                  alt={item?.value}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${MISC_IMAGES_PATH}placeholder.webp`;
                  }}
                />
              </Radio.Button>
            );
          })}
        </Radio.Group>
      );
    },
    select: (field) => (
      <Select
        id={id}
        name={name}
        autoComplete={autoComplete}
        optionFilterProp={optionFilterProp}
        showSearch={showSearch}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(value) => field?.onChange(value)}
        defaultValue={field?.value === '' ? placeholder : defaultValue}
        filterOption={filterOption}
        filterSort={filterSort}
        options={selectOptions}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        onFocus={onFocus}
        className={classNameInput}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        placement={placement}
        dropdownStyle={dropdownStyle}
      >
        {!withoutSelectOption
          ? selectOptions?.map((item, id) => (
              <Select.Option key={id} value={item}>
                {words ? words[item] : item}
              </Select.Option>
            ))
          : null}
      </Select>
    ),
    phoneInput: (field) => {
      return (
        <PhoneInput
          {...field}
          id={id}
          disabled={disabled}
          showDisabledDialCodeAndPrefix={showDisabledDialCodeAndPrefix}
          disableDialCodeAndPrefix={disableDialCodeAndPrefix}
          forceDialCode={forceDialCode}
          DialCodePreview={dialCodePreview}
          placeholder={placeholder}
          defaultValue={defaultValue}
          value={field.value ?? defaultValue}
          className={classNameInput}
          defaultCountry={defaultCountry}
          countries={settings.countries}
          onFocus={onFocus}
        />
      );
    },
    cardNumber: (field) => {
      const { mask, holder } = getVariableMask(placeholder);

      return (
        <InputMask mask={mask} placeholder={holder} maskChar={null} value={field.value ?? defaultValue} onChange={field.onChange}>
          {(inputProps) => <Input name={name} {...inputProps} id={id} autoComplete={autoComplete} className={classNameInput} />}
        </InputMask>
      );
    },
    cardExpiry: (field) => {
      const { mask } = getVariableMask(name);

      return (
        <InputMask mask={mask} placeholder={placeholder} maskChar={null} value={field.value ?? defaultValue} onChange={field.onChange}>
          {(inputProps) => <Input name={name} {...inputProps} id={id} autoComplete={autoComplete} className={classNameInput} />}
        </InputMask>
      );
    },
  };

  return (
    <Fragment>
      {required && signUpError && <Error className={'required-field'}>* Required field</Error>}
      <section className={className} ref={dropdownRef}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => {
            return hasField[fieldType](field);
          }}
        />
        {children}
      </section>
      {errors && fieldType !== 'phoneInput' && errors[name]?.message && <Error className="errors">{translateField(errors[name]?.message, translate, false)}</Error>}
    </Fragment>
  );
};

ControllerForm.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  fieldType: PropTypes.string,
  dropdownStyle: PropTypes.object,
  value: PropTypes.string,
  errors: PropTypes.object,
  withoutSelectOption: PropTypes.bool,
  control: PropTypes.object.isRequired,
  className: PropTypes.string,
  classNameInput: PropTypes.string,
  defaultCountry: PropTypes.string,
  radio: PropTypes.string,
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  selectOptions: PropTypes.array,
  forceDialCode: PropTypes.bool,
  dialCodePreview: PropTypes.element,
  disableDialCodeAndPrefix: PropTypes.bool,
  showDisabledDialCodeAndPrefix: PropTypes.bool,
  words: PropTypes.object,
  picker: PropTypes.any,
  format: PropTypes.string,
  children: PropTypes.element,
  required: PropTypes.bool,
  signUpError: PropTypes.bool,
  showNow: PropTypes.bool,
  disabledDate: PropTypes.func,
  label: PropTypes.string,
  showSearch: PropTypes.bool,
  optionFilterProp: PropTypes.string,
  filterOption: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  filterSort: PropTypes.func,
};
