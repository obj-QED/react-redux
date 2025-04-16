import React, { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { ControllerForm } from '../../elements';
import { useIpUser } from '../../hooks';
import { translateField } from '../../shared/utils';
import { Error } from './ControllerFormStyles';

export const ValidationPhone = ({ field, form, className = 'wallet-block-form', label, required = true }) => {
  const { errors, control, watch, handle, setError, clearErrors, getValues, isFieldPhone, forceDialCode = true } = form;
  const { ipInfo } = useIpUser();
  const words = useSelector((state) => state.words);
  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };

  const getValue = getValues('phone');
  const watchPhone = watch('phone');
  const isValid = isPhoneValid(getValue ?? watchPhone);
  const localValidation = localStorage.getItem('phone_validation');

  useEffect(() => {
    if (handle && isFieldPhone && watchPhone) {
      localStorage.setItem('phone_validation', isValid ? '0' : '1');
    }
  }, [isValid, handle, isFieldPhone, watchPhone, required]);

  useEffect(() => {
    if (localValidation === '1' && handle && !errors[field]) {
      setError(field, { type: 'validation', message: handle && watchPhone?.length ? 'phone_is_not_valid' : 'phone_required' });
    } else {
      clearErrors(field);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localValidation, field, isValid]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('phone_validation');
    };
  }, []);

  return (
    <Fragment>
      <ControllerForm
        id={field}
        name={field}
        className={className}
        fieldType="phoneInput"
        placeholder={field && translateField(field, words)}
        defaultCountry={ipInfo?.country?.toLowerCase()}
        DialCodePreview={ipInfo?.country}
        forceDialCode={forceDialCode}
        errors={errors}
        control={control}
      >
        {label && <label htmlFor="phoneInput">{translateField(field, words)}</label>}
      </ControllerForm>
      {errors[field]?.message && localValidation === '1' && <Error className="error">{translateField(errors[field]?.message, words, false, false)}</Error>}
    </Fragment>
  );
};
