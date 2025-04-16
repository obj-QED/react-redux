import React, { Fragment, useRef, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import IntlTelInput from 'react-intl-tel-input';
import { setActiveInput } from '../../store/actions';

export const PhoneInput = memo(({ placeholder = '', onChange, onChangeCountry, defaultCountry, disabled = false }) => {
  const ref = useRef(null);
  const dispatch = useDispatch();

  // Получаем данные из глобального состояния Redux
  const words = useSelector((state) => state.words);
  const settings = useSelector((state) => state.settings);

  // Получаем страну из локального хранилища или false, если ее нет
  const country = localStorage.getItem('itiAutoCountry') || false;

  // Мемоизированный колбэк для handleFocus
  const handleFocus = useCallback(() => {
    if (settings.virtualKeyboard) {
      dispatch(setActiveInput(ref.current?.tel));
    }
  }, [dispatch, settings.virtualKeyboard]);

  // Мемоизированные колбэки для handleChange и handleChangeCountry
  const handleChange = useCallback(
    (isvalid, value, event) => {
      onChange(isvalid, value, event);
    },
    [onChange],
  );

  const handleChangeCountry = useCallback(
    (isvalid, value, event) => {
      onChangeCountry(isvalid, value, event);
      if (value.iso2) {
        localStorage.setItem('itiAutoCountry', value.iso2);
      }
    },
    [onChangeCountry],
  );

  return (
    <Fragment>
      {settings.labelsForInputs && <span className="label">{words.server.enter_phone}</span>}
      <div className="PhoneInput" onFocus={handleFocus}>
        <IntlTelInput
          ref={ref}
          inputClassName="input"
          formatOnInit={false}
          nationalMode={true}
          defaultCountry={defaultCountry?.country?.toLowerCase() ?? 'auto'}
          geoIpLookup={country}
          separateDialCode={true}
          disabled={disabled}
          onPhoneNumberChange={handleChange}
          format={false}
          onSelectFlag={handleChangeCountry}
          placeholder={!settings.labelsForInputs ? placeholder : ''}
        />
      </div>
    </Fragment>
  );
});
