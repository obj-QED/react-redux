import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { translateField } from '../../../shared/utils';

const VerificationButton = ({ item, verification, handleVerify, watch, dispatch, isPhoneFieldInvalid }) => {
  const words = useSelector((state) => state.words);

  const parseBoolean = useCallback((value) => {
    if (typeof value === 'string') return Boolean(Number(value));
    if (typeof value === 'number') return Boolean(value);
    if (typeof value === 'boolean') return value;
    return false;
  }, []);

  const isEditDisabled = !parseBoolean(item?.edit);
  const disabledVerify = (item?.id === 'phone' && isPhoneFieldInvalid()) || !Boolean(watch(item?.id));

  // Проверяем наличие verification. Если нет, то не рендерим кнопку.
  if (!parseBoolean(item?.verification) && !parseBoolean(verification)) return null;

  // Если edit равен 0, рендерим заблокированную кнопку
  if (isEditDisabled) {
    return <div className={classNames('form_events form_events--verification', { disabled: true })}>{translateField('verifed', 'auth.button', words, false)}</div>;
  }

  // Кнопка активна только если edit 1 и есть handleVerify
  if (!isEditDisabled && handleVerify) {
    return (
      <div
        className={classNames('form_events form_events--verification', { disabled: disabledVerify })}
        onClick={(e) => {
          if (!disabledVerify) handleVerify(e, item, watch(item?.id));

          if (item?.id === 'phone') {
            dispatch({
              type: 'SIGNUP_PHONE_NUMBER',
              payload: watch(item.id),
            });
          }
        }}
      >
        {translateField('verify', 'auth.button', words, false)}
      </div>
    );
  }

  return null;
};

export default VerificationButton;
