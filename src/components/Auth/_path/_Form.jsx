import React, { memo, useMemo, useEffect, useCallback, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import dayjs from 'dayjs';
import classNames from 'classnames';
import styled from 'styled-components';
import ReactInlineSvg from 'react-inlinesvg';
import Masonry from 'react-masonry-component';
import countryToCurrency from 'country-to-currency';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PhoneNumberUtil } from 'google-libphonenumber';

import { ControllerForm, AcceptTerms, ButtonsEl } from '../../../elements';

import { authGetMessage } from '../../../store/actions';

import { options } from '../../../shared/constants';
import { useIpUser, useCopyClipboard } from '../../../hooks';
import { translateField } from '../../../shared/utils';

import { buildSchema } from '../../../schemas/AuthSchema';

import postcodes from '../assets/postcode.json';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';
import VerificationButton from './_VerificationField';

const verifyIcon = `${UI_IMAGES_PATH}check-circle.${UI_IMAGES_FORMAT}`;
const copyIcon = `${UI_IMAGES_PATH}copy.${UI_IMAGES_FORMAT}`;
const closeCircle = `${UI_IMAGES_PATH}close-circle.${UI_IMAGES_FORMAT}`;

export const Error = styled.div`
  margin-top: 6px;
  margin-bottom: 5px;
  margin-left: 5px;
  color: var(--auth-forms-error-field, #ff0000);
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
  letter-spacing: 0;
`;

const Form = memo(
  ({
    className,
    fields,
    event,
    onSuccess,
    onError,
    messageSuccess,
    messageError = true,
    button = 'event',
    termsChecked = false,
    termsCheckedTicked = false,
    otherTermsChecked = false,
    otherTermsCheckedTicked = false,
    supportTermsChecked = false,
    supportTermsCheckedTicked = false,
    showCountdown = false,
    formId,
    resetForm = false,
    verification = false,
    handleVerify,
    schemaForm = buildSchema,
    masonry = false,
    customFieldsForm,
    eventNullData = false,
  }) => {
    const dispatch = useDispatch();
    const { ipInfo } = useIpUser();
    const countryList = require('country-list');

    const words = useSelector((state) => state.words);
    const form = useSelector((state) => state.authorization?.form);
    const init = useSelector((state) => state.api);

    const [formErrorsField, setFormErrorsField] = useState(null);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);
    const [isFieldsDisabled, setIsFieldsDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [termsAccepted, setTermsAccepted] = useState(termsCheckedTicked);
    const [otherTermsAccepted, setOtherTermsAccepted] = useState(otherTermsCheckedTicked);
    const [spportTermsAccepted, setSupportTermsAccepted] = useState(supportTermsCheckedTicked);
    const [copyFieldMessage, copyToClipboard] = useCopyClipboard();
    const [loadingRequest, setLoadingRequest] = useState(false);

    const sendAgain = localStorage.getItem('send-again-submit');
    const sendAgainFormId = localStorage.getItem('send-again-form-id');
    const currency = useMemo(() => {
      return init.currency?.includes(countryToCurrency[ipInfo.country]) ? countryToCurrency[ipInfo.country] : init.currency?.[0] ?? null;
    }, [ipInfo?.country, init.currency]);

    const countries = countryList.getData();
    const formattedCountries = countries?.map((country) => ({ value: country.code, label: country.name }));

    const getFormFields = useMemo(() => {
      if (Array.isArray(fields)) {
        return { fields: fields };
      } else if (fields?.fields) {
        return { fields: [...fields?.fields], className: fields?.className, label: fields?.label, ...fields };
      }
      return { fields: [] };
    }, [fields]);

    const formFields = useMemo(() => {
      const additionalFields = [...getFormFields.fields];

      if (termsChecked) {
        additionalFields.push({ id: 'terms_checked', require: '1' });
      }
      if (otherTermsChecked) {
        additionalFields.push({ id: 'confirm_news_email_marketing', require: '1' });
      }

      if (supportTermsChecked) {
        additionalFields.push({ id: 'confirm_message_support', require: '1' });
      }

      return [...additionalFields];
    }, [getFormFields, termsChecked, otherTermsChecked, supportTermsChecked]);

    const validationContext = useMemo(() => {
      return formFields?.reduce((acc, field) => {
        const contextData = {};

        Object.keys(field).forEach((key) => {
          contextData[key] = field[key];
        });

        acc[field?.id] = contextData;

        return acc;
      }, {});
    }, [formFields]);

    const schema = useMemo(() => schemaForm(formFields), [formFields, schemaForm]);

    const isFieldPhone = formFields?.some((field) => field?.id === 'phone');

    const paramFieldsDefault = useMemo(() => {
      const defaultFields = {};
      const country = formattedCountries?.find((country) => country.value === ipInfo.country)?.value ?? options[0];
      const promoCode = localStorage.getItem('promoCode');
      const postCode = postcodes.find((item) => item.country === ipInfo.country)?.postcode;

      formFields?.forEach((field) => {
        const fieldKey = field?.id;
        if (!fieldKey) return;
        let defaultValue = field.defaultValue;

        switch (fieldKey) {
          case 'country':
            defaultValue = country;
            break;
          case 'promoCode':
            defaultValue = promoCode;
            break;
          case 'postCode':
            defaultValue = postCode;
            break;
          case 'currency':
            defaultValue = defaultValue || currency;
            break;
          default:
            break;
        }
        defaultFields[fieldKey] = defaultValue;
      });

      return defaultFields;
    }, [ipInfo.country, currency, formattedCountries, formFields]);

    const defaultValues = useMemo(() => ({ ...paramFieldsDefault }), [paramFieldsDefault]);
    const {
      handleSubmit,
      control,
      watch,
      getValues,
      setValue,
      reset,
      formState: { errors, isValid, touchedFields },
    } = useForm({
      defaultValues,
      resolver: yupResolver(schema),
      context: validationContext,
      mode: 'onChange',
    });

    const [_, setClickedField] = useState(null);

    const clearMessage = useCallback(() => {
      dispatch(authGetMessage(undefined));
      setFormError(null);
      setFormSuccess(null);

      if (form?.error)
        dispatch({
          type: 'SIGNIN_ERROR',
          payload: undefined,
        });
      else if (form?.success)
        dispatch({
          type: 'SIGNIN_TYPE_SUCCESS',
          payload: undefined,
        });
    }, [form?.error, form?.success, dispatch]);

    const handleFocus = useCallback(
      (field) => {
        setFormErrorsField(field);
        setClickedField(field);
        clearMessage();
      },
      [clearMessage],
    );

    const searchValueCodeInListCountry = useCallback(() => {
      const el = document.querySelectorAll('.react-international-phone-country-selector-dropdown__list-item-dial-code');
      const watchPhone = watch('phone');
      const arr = [];
      const searchCodeForWatchPhone = (code) => {
        el?.forEach((item) => {
          arr.push(item.textContent);
        });

        return arr.includes(code?.replace(/\s/g)) ? false : true;
      };

      return searchCodeForWatchPhone(watchPhone);
    }, [watch]);

    const isDeletePhone = useCallback(() => {
      const result = isFieldPhone && Boolean(searchValueCodeInListCountry());
      if (result) {
        return true;
      } else if (!result) {
        return false;
      } else return;
    }, [searchValueCodeInListCountry, isFieldPhone]);

    const handle = useCallback(
      async (data) => {
        setLoadingRequest(true);
        const response = await event(data);
        if (response?.error) {
          await setFormError(response?.error);
          if (onError) {
            await onError(response?.error);
            await dispatch(authGetMessage(response?.error));
            setValue('terms_checked', termsAccepted);
            setValue('confirm_news_email_marketing', otherTermsAccepted);
            setValue('confirm_message_support', spportTermsAccepted);
          }
        } else if (response?.content) {
          await setFormError(null);
          await setFormSuccess(response);
          if (onSuccess) {
            await onSuccess(response);
            await dispatch(authGetMessage(response?.content?.message));
          }
        }

        setLoadingRequest(false);
      },
      [event, onSuccess, onError, dispatch, termsAccepted, otherTermsAccepted, spportTermsAccepted, setValue],
    );

    const onSubmit = useCallback(
      (data) => {
        clearMessage();
        dispatch(authGetMessage(undefined));

        if (!isDeletePhone(data.phone)) {
          setValue('phone', '');
        }

        if (data?.terms_checked) delete data?.terms_checked;
        if (data?.confirm_news_email_marketing) delete data?.confirm_news_email_marketing;
        if (data?.confirm_message_support) delete data?.confirm_message_support;

        if (!eventNullData)
          Object.keys(data).forEach((key) => {
            if (data[key] === undefined || data[key] === '' || data[key] === null) {
              delete data[key];
            }
          });
        event && handle(data);
      },
      [isDeletePhone, handle, event, clearMessage, dispatch, eventNullData, setValue],
    );

    useEffect(() => {
      if (sendAgain && showCountdown && sendAgainFormId === formId) {
        setFormError('timer_wa');
        const currentTime = new Date().getTime();
        const endTime = Number(sendAgain);
        const remainingTime = Math.max(Math.ceil((endTime - currentTime) / 1000), 0);
        setCountdown(remainingTime);
        setIsFieldsDisabled(true);

        const timer = setInterval(() => {
          setCountdown((prevCountdown) => {
            const updatedCountdown = Math.max(prevCountdown - 1, 0);
            if (updatedCountdown <= 0) {
              clearInterval(timer);
              localStorage.removeItem('send-again-submit');
              localStorage.removeItem('send-again-form-id');
              setIsFieldsDisabled(false);
              setFormError(null); // Reset error when countdown ends
            }
            return updatedCountdown;
          });
        }, 1000);

        return () => clearInterval(timer); // Clean up the timer on component unmount or when `sendAgain` changes
      } else {
        setIsFieldsDisabled(false);
        setFormError(null); // Reset error if `sendAgain` is not set
      }
    }, [sendAgain, showCountdown, formId, sendAgainFormId]);

    const handleChangeTerms = useCallback(
      (value) => {
        setTermsAccepted(value);
        setValue('terms_checked', value, { shouldValidate: true });
      },
      [setValue],
    );

    const handleChangeOtherTerms = useCallback(
      (value) => {
        setOtherTermsAccepted(value);
        setValue('confirm_news_email_marketing', value, { shouldValidate: true });
      },
      [setValue],
    );

    const handleChangeSupportTerms = useCallback(
      (value) => {
        setSupportTermsAccepted(value);
        setValue('confirm_message_support', value, { shouldValidate: true });
      },
      [setValue],
    );

    const renderErrors = useMemo(() => {
      if (formError && ((formError === 'timer_wa' && typeof formError === 'string') || typeof formError === 'number')) return;

      if (formError && typeof formError === 'object') {
        return Object.entries(formError).map(([key, value]) => (
          <div key={key} className="auth-form-errors">
            <Error className="item">
              {translateField(key, 'auth.error', words)} {translateField(value, 'auth.error', words, false)}
            </Error>
          </div>
        ));
      } else if (formError && typeof formError === 'string') {
        return (
          <div className="auth-form-errors" key={formError}>
            <Error className="item">{translateField(formError, 'auth.input', words, false)}</Error>
          </div>
        );
      } else return null;
    }, [formError, words]);

    const renderSuccess = useMemo(() => {
      if (formSuccess && messageSuccess)
        return (
          <div className="form-success" key={messageSuccess}>
            <Error className="item">{translateField(messageSuccess, 'auth.error', words, false)}</Error>
          </div>
        );
    }, [messageSuccess, words, formSuccess]);

    const parseBoolean = useCallback((value) => {
      if (typeof value === 'string') return Boolean(Number(value));
      else if (typeof value === 'number') return Boolean(value);
      else if (typeof value === 'boolean') return value;
    }, []);

    const isDisabled = useCallback(
      (item) => {
        return (
          (Boolean(verification) && !parseBoolean(item?.edit)) ||
          (Boolean(verification) && !parseBoolean(item.edit) && parseBoolean(item?.verification)) ||
          parseBoolean(item?.disabled) ||
          isFieldsDisabled ||
          sendAgainFormId === formId
        );
      },
      [verification, isFieldsDisabled, sendAgainFormId, formId, parseBoolean],
    );

    const isPhoneFieldInvalid = useCallback(() => {
      if (!isFieldPhone) return false;

      const phoneValue = watch('phone');
      if (!phoneValue || !verification || !handleVerify) return true;

      const phoneUtil = PhoneNumberUtil.getInstance();
      try {
        return !phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phoneValue));
      } catch (error) {
        return true;
      }
    }, [watch, verification, handleVerify, isFieldPhone]);

    const changeMaxValueBalance = useCallback(() => {
      setValue('amount', getFormFields.maxValue);
    }, [setValue, getFormFields]);

    const clearValue = useCallback(() => {
      setValue('amount', getFormFields.handleAmountClear);
    }, [setValue, getFormFields]);

    const renderFieldsForm = useMemo(() => {
      const sortedFormFields = formFields?.slice().sort((a, b) => {
        if (a.id === 'terms_checked') return 1;
        if (b.id === 'terms_checked') return -1;
        return 0;
      });

      const field = sortedFormFields?.map((item, index) => {
        const fieldKey = `field-${item?.id}-${index}`; // Unique key for each field
        const fieldLabel = `label-${item?.id}-${index}`; // Unique key for each field
        const fieldProps = {
          key: `${item?.id}-${index}`,
          ...(item.type && { type: item.type }),
          id: item?.id,
          name: item?.id,
          bordered: false,
          autoComplete: item?.id,
          control,
          errors: verification ? (formErrorsField === item?.id ? errors : null) : errors,
          disabled: isDisabled(item),
          defaultValue: getValues(item?.id) ?? item?.defaultValue,
          onFocus: () => handleFocus(item?.id),
        };

        const isSelect = !!item?.options;
        const isRequired = item?.require === '1' || item?.require === 1 || item?.require === true;

        switch (item?.id) {
          case 'amount':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
                field-name={item?.id}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}

                <ControllerForm
                  {...fieldProps}
                  fieldType="input"
                  min={getFormFields.min}
                  max={getFormFields.max}
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  classNameInput="auth-form_field-input"
                >
                  {getFormFields?.button_all && (
                    <div className="btn-actions">
                      <ButtonsEl className="button--all" onClick={() => changeMaxValueBalance()}>
                        {translateField('button_all', 'auth.button', words)}
                      </ButtonsEl>
                      <div className="amount-type">
                        <ReactInlineSvg
                          src={closeCircle}
                          title="X"
                          className="handle"
                          onClick={(e) => {
                            e.preventDefault();
                            clearValue();
                          }}
                          cacheRequests
                        />
                      </div>
                    </div>
                  )}
                </ControllerForm>

                {Boolean(getFormFields?.available_currency) && (
                  <div className="info-text">
                    <span className="available-balance">
                      {`${translateField('available_withdraw', 'balance.input', words)}: 
                      ${getFormFields?.available_currency}`}
                    </span>
                  </div>
                )}
              </div>
            );
          case 'phone':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  fieldType="phoneInput"
                  classNameInput="auth-form_field-input auth-input-phone"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  defaultCountry={ipInfo?.country?.toLowerCase()}
                  DialCodePreview={ipInfo?.country}
                  forceDialCode
                >
                  <VerificationButton
                    item={item}
                    verification={verification}
                    handleVerify={handleVerify}
                    watch={watch}
                    dispatch={dispatch}
                    isPhoneFieldInvalid={isPhoneFieldInvalid}
                  />
                </ControllerForm>
                {errors[item?.id] &&
                  touchedFields[item?.id] &&
                  (verification ? (
                    formErrorsField === item?.id && <Error className="errors">{translateField(errors[item?.id]?.message, 'auth.error', words, false)}</Error>
                  ) : (
                    <Error className="errors">{translateField(errors[item?.id]?.message, 'auth.error', words, false)}</Error>
                  ))}
              </div>
            );
          case 'email':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  fieldType="input"
                  classNameInput="auth-form_field-input"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                >
                  <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                </ControllerForm>
              </div>
            );
          case 'password':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  fieldType="inputPassword"
                  classNameInput="auth-form_field-input auth-input-password"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  className="input-password"
                />
              </div>
            );
          case 'login':
            if (!verification || !item?.verification) {
              return (
                <div
                  className={classNames('auth-form_field', {
                    [getFormFields?.className]: getFormFields?.className,
                    disabled: isDisabled(item),
                  })}
                  key={fieldKey}
                >
                  {getFormFields?.label && (
                    <label className="label" key={fieldLabel} htmlFor={item?.id}>
                      {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                    </label>
                  )}
                  <ControllerForm
                    {...fieldProps}
                    fieldType="input"
                    classNameInput="auth-form_field-input"
                    placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  ></ControllerForm>
                </div>
              );
            } else return null;
          case 'country':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  // showSearch={formattedCountries?.length !== 0 || options?.length !== 0}
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  selectOptions={formattedCountries ?? options}
                  fieldType="select"
                  classNameInput="auth-form_field-input auth-input-select"
                  filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
                  filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                  defaultValue={getValues(item?.id) ?? item?.defaultValue}
                >
                  <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                </ControllerForm>
              </div>
            );
          case 'currency':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  // showSearch={item?.options?.length}
                  defaultValue={getValues(item?.id)}
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  fieldType="select"
                  classNameInput="auth-form_field-input auth-input-select"
                  selectOptions={item?.options?.map((option) => {
                    return {
                      value: option,
                      label: option,
                    };
                  })}
                >
                  <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                </ControllerForm>
              </div>
            );
          case 'terms_checked':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                <AcceptTerms onChange={handleChangeTerms} termsChecked={termsAccepted} />
                {errors[item?.id]?.message && <Error className="errors">{translateField(errors[item?.id]?.message, 'auth.error', words, false)}</Error>}
              </div>
            );

          case 'confirm_news_email_marketing':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                <AcceptTerms className="email-confirm" keyLang="confirm_news_email_marketing" onChange={handleChangeOtherTerms} termsChecked={otherTermsAccepted} />
                {errors[item?.id]?.message && <Error className="errors">{translateField(errors[item?.id]?.message, 'auth.error', words, false)}</Error>}
              </div>
            );

          case 'confirm_message_support':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                <AcceptTerms className="email-confirm" keyLang="confirm_message_support" onChange={handleChangeSupportTerms} termsChecked={spportTermsAccepted} />
                {errors[item?.id]?.message && <Error className="errors">{translateField(errors[item?.id]?.message, 'auth.error', words, false)}</Error>}
              </div>
            );

          case 'new_password':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  autoComplete="password"
                  fieldType="input"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  classNameInput="text-security auth-form_field-input"
                />
              </div>
            );
          case 'pix_key':
            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  classNameInput="auth-form_field-input"
                  fieldType="cardNumber"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  filterOption="pix_dash"
                  autoComplete="off"
                >
                  <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                </ControllerForm>
              </div>
            );
          case 'id':
            const verifyAccount = verification?.verificationLevel;
            const copyButton = (
              <span key={`button_${item?.id}`} className="copy-clipboard-button" onClick={() => copyToClipboard(item?.id)}>
                <ReactInlineSvg src={copyIcon} title="copy" cacheRequests />
                {copyFieldMessage && copyFieldMessage[item?.id] && (
                  <div className="copy-clipboard-button_message">{translateField(Boolean(copyFieldMessage[item?.id]) && copyFieldMessage[item?.id], 'basic', words, false)}</div>
                )}
              </span>
            );

            const inputId = (
              <Fragment>
                {getFormFields?.label && !verifyAccount && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  autoComplete="off"
                  className={verifyAccount ? 'auth-form_field_verify' : ''}
                  classNameInput="auth-form_field-input"
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                >
                  {Boolean(verification) && copyButton}
                </ControllerForm>
              </Fragment>
            );

            switch (verifyAccount) {
              case true:
                return (
                  <div
                    className={classNames('auth-form_field', {
                      [getFormFields?.className]: getFormFields?.className,
                      disabled: isDisabled(item),
                    })}
                    key={`verifyAccount_${fieldKey}`}
                  >
                    {getFormFields?.label && (
                      <label className="label" key={`verifyAccount_${fieldLabel}`} htmlFor={item?.id}>
                        {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      </label>
                    )}

                    <div className="verify-id" key={`verify-id_${fieldLabel}`}>
                      {inputId}
                      <div className="input-field input-field-verify">
                        <div className="verify-account">
                          <ReactInlineSvg src={verifyIcon} title="account verifed" cacheRequests />
                          <span>{translateField('verifed', 'auth.input', words, false)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              case false:
                return (
                  <div
                    className={classNames('auth-form_field', {
                      [getFormFields?.className]: getFormFields?.className && !verifyAccount,
                      disabled: isDisabled(item),
                    })}
                    key={fieldKey}
                  >
                    {inputId}
                  </div>
                );
              default:
                return (
                  <div
                    className={classNames('auth-form_field', {
                      [getFormFields?.className]: getFormFields?.className && !verifyAccount,
                      disabled: isDisabled(item),
                    })}
                    key={fieldKey}
                  >
                    {inputId}
                  </div>
                );
            }
          case 'birthDay':
            const defaultValue = getValues(item?.id) || item?.defaultValue;
            const formatDate = 'YYYY-MM-DD';

            return (
              <div
                className={classNames('auth-form_field', {
                  [getFormFields?.className]: getFormFields?.className,
                  disabled: isDisabled(item),
                })}
                key={fieldKey}
              >
                {getFormFields?.label && (
                  <label className="label" key={fieldLabel} htmlFor={item?.id}>
                    {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                    {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                  </label>
                )}
                <ControllerForm
                  {...fieldProps}
                  classNameInput="auth-form_field-input date-picker"
                  format={formatDate}
                  fieldType="datePicker"
                  showNow={false}
                  defaultValue={!!defaultValue && defaultValue !== '0000-00-00' ? dayjs(defaultValue, formatDate).endOf('day') : dayjs(dayjs().subtract(18, 'years'), formatDate)}
                  disabledDate={(current) => current && current > dayjs().subtract(18, 'years')}
                  placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                >
                  <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                </ControllerForm>
              </div>
            );

          case 'thb_bank_code':
            if (formId !== 'profile-form') {
              return (
                <div
                  className={classNames('auth-form_field', {
                    [getFormFields?.className]: getFormFields?.className,
                    disabled: isDisabled(item),
                  })}
                  key={fieldKey}
                >
                  {getFormFields?.label && (
                    <label className="label" key={fieldLabel} htmlFor={item?.id}>
                      {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                    </label>
                  )}
                  <ControllerForm
                    {...fieldProps}
                    defaultValue={getValues(item?.id)}
                    placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                    fieldType="radio"
                    classNameInput="auth-form_field-input auth-input-radio"
                    selectOptions={item?.options?.map((option) => {
                      return {
                        value: option[0],
                        label: option[1],
                        image: `/uploads/thb_bank_icon/${option[0]}`,
                      };
                    })}
                  >
                    <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                  </ControllerForm>
                </div>
              );
            } else {
              return (
                <div
                  className={classNames('auth-form_field', {
                    [getFormFields?.className]: getFormFields?.className,
                    disabled: isDisabled(item),
                    [`auth-form_field__${item?.id}`]: item?.id,
                  })}
                  key={fieldKey}
                >
                  {getFormFields?.label && (
                    <label className="label" key={fieldLabel} htmlFor={item?.id}>
                      {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                    </label>
                  )}
                  <ControllerForm
                    {...fieldProps}
                    // showSearch={item?.options?.length !== 0}
                    defaultValue={getValues(item?.id)}
                    placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                    fieldType="select"
                    classNameInput="auth-form_field-input auth-input-select"
                    selectOptions={item?.options?.map((option) => {
                      return {
                        value: option,
                        label: option,
                      };
                    })}
                  >
                    <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                  </ControllerForm>
                </div>
              );
            }

          default:
            if (isSelect) {
              return (
                <div
                  className={classNames('auth-form_field', {
                    [getFormFields?.className]: getFormFields?.className,
                    disabled: isDisabled(item),
                    [`auth-form_field__${item?.id}`]: item?.id,
                  })}
                  key={fieldKey}
                  field-name={item?.id}
                >
                  {getFormFields?.label && (
                    <label className="label" key={fieldLabel} htmlFor={item?.id}>
                      {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                    </label>
                  )}
                  <ControllerForm
                    {...fieldProps}
                    // showSearch={item?.options?.length !== 0}
                    defaultValue={getValues(item?.id)}
                    placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                    fieldType="select"
                    classNameInput="auth-form_field-input auth-input-select"
                    selectOptions={item?.options?.map((option) => {
                      return {
                        value: option,
                        label: option,
                      };
                    })}
                  >
                    <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                  </ControllerForm>
                </div>
              );
            } else
              return (
                <div
                  className={classNames('auth-form_field', {
                    [getFormFields?.className]: getFormFields?.className,
                    disabled: isDisabled(item),
                    [`auth-form_field__${item?.id}`]: item?.id,
                    visibilityHidden: item?.id === 'promoCode' && localStorage.getItem('promoCode'),
                  })}
                  key={fieldKey}
                  field-name={item?.id}
                >
                  {getFormFields?.label && (
                    <label className="label" key={fieldLabel} htmlFor={item?.id}>
                      {translateField(`enter_${item?.id}`, 'auth.input', words, false)}
                      {isRequired && <span style={{ color: 'red', marginLeft: '4px' }}>*</span>}
                    </label>
                  )}
                  <ControllerForm
                    {...fieldProps}
                    fieldType="input"
                    classNameInput="auth-form_field-input"
                    placeholder={translateField(`placeholder_${item?.id}`, 'auth.input', words)}
                  >
                    <VerificationButton item={item} verification={verification} handleVerify={handleVerify} watch={watch} dispatch={dispatch} />
                  </ControllerForm>
                </div>
              );
        }
      });

      const masonryOptions = {
        transitionDuration: 5,
        gutter: 10,
        itemSelector: '.auth-form_field',

        resize: true,
        horizontalOrder: true,
        initLayout: false,
      };
      return (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classNames('form', {
            [className]: className,
          })}
          autoComplete="off"
          key={formId}
          data-form={formId}
          data-hj-suppress
        >
          {masonry ? (
            <Masonry disableImagesLoaded={false} updateOnEachImageLoad={false} className={'form-massonry'} options={masonryOptions}>
              {field}
            </Masonry>
          ) : (
            field
          )}

          {customFieldsForm}

          {button?.type && button?.name && (
            <ButtonsEl
              type="submit"
              disabled={!isValid || (showCountdown && sendAgain && sendAgainFormId === formId) || button?.disabled}
              loading={button?.loading || loadingRequest}
              className={classNames('auth-form_events', {
                [button?.type]: button?.type,
                proccess: button?.disabled,
              })}
            >
              {translateField(button?.name, 'auth.button', words)}
            </ButtonsEl>
          )}

          {countdown > 0 && showCountdown && sendAgain && (
            <div className="auth-form__message auth-form__message_timer-wa">
              {translateField('timer_wa', 'auth.message', words)} {countdown} {translateField('second', 'auth.message', words)}
            </div>
          )}

          {renderSuccess}
          {form?.message && messageError && renderErrors}
        </form>
      );
    }, [
      customFieldsForm,
      spportTermsAccepted,
      handleChangeSupportTerms,
      loadingRequest,
      changeMaxValueBalance,
      clearValue,
      dispatch,
      masonry,
      formErrorsField,
      isPhoneFieldInvalid,
      isDisabled,
      className,
      handleVerify,
      verification,
      watch,
      getFormFields,
      form?.message,
      messageError,
      sendAgainFormId,
      formId,
      renderSuccess,
      renderErrors,
      termsAccepted,
      otherTermsAccepted,
      countdown,
      showCountdown,
      sendAgain,
      control,
      errors,
      words,
      formFields,
      handleSubmit,
      onSubmit,
      isValid,
      button,
      ipInfo,
      touchedFields,
      getValues,
      formattedCountries,
      handleChangeTerms,
      handleChangeOtherTerms,
      handleFocus,
      copyFieldMessage,
      copyToClipboard,
    ]);

    useEffect(() => {
      return () => {
        setFormError(null);
        setFormSuccess(null);
      };
    }, [onError, onSuccess]);

    useEffect(() => {
      if (resetForm) {
        reset();
      }
    }, [resetForm, formId, reset]);

    if (!formFields && formFields?.length === 0 && !formFields?.some((field) => field?.id)) return null;

    return renderFieldsForm;
  },
);

export default Form;
