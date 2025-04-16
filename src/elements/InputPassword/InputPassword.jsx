import React, { useState, useRef, useCallback, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import { setActiveInput } from '../../store/actions';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';
import { Error } from './InputPasswordStyles';

const eyeIcon = `${UI_IMAGES_PATH}eye.${UI_IMAGES_FORMAT}`;

export const InputPassword = memo(({ placeholder, onChange, label, name, required, isRegister }) => {
  const dispatch = useDispatch();
  const ref = useRef();
  const handling = useSelector((state) => state.handling);
  const settings = useSelector((state) => state.settings);

  const [generateId] = useState(() => uuid()); // Генерация идентификатора при монтировании компонента

  const [visible, setVisible] = useState(false);
  const [validate, setValidate] = useState('');

  // Мемоизированный колбэк для handleChange
  const handleChange = useCallback(
    (event) => {
      const value = event.target.value;
      const reg = /^[A-Za-z0-9_.]+$/;

      if (!reg.test(value)) {
        setValidate('Password must include Uppercase, numbers, and symbols');
      } else {
        setValidate('');
      }

      onChange?.(event);

      if (settings.virtualKeyboard && !handling.size.mobile) {
        window.VirtualKeyboard.setInput(event.target.value);
      }
    },
    [onChange, handling.size.mobile, settings.virtualKeyboard],
  );

  // Мемоизированный колбэк для handleFocus
  const handleFocus = useCallback(
    (event) => {
      if (settings.virtualKeyboard && !handling.size.mobile) {
        dispatch(setActiveInput(generateId));
        window.VirtualKeyboard.setInput(event.target.value);
      }
    },
    [dispatch, generateId, handling.size.mobile, settings.virtualKeyboard],
  );

  return (
    <div className="InputPassword-wrapper">
      <div className="InputPassword">
        <input
          required={required}
          name={name}
          ref={ref}
          id={generateId}
          key={generateId}
          className="input"
          type={!visible ? 'password' : 'text'}
          onFocus={handleFocus}
          onChange={handleChange}
          placeholder={placeholder ? placeholder : 'words.server.password'}
        />
        <div className="visible" data-active={visible} onClick={() => setVisible(!visible)}>
          <img src={eyeIcon} alt="Eye" />
        </div>
      </div>
      {validate && isRegister && <Error className="error">{validate}</Error>}
    </div>
  );
});
