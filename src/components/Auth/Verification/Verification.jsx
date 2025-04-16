import React, { Fragment, useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';

import { useNavigate } from 'react-router-dom';
import { getVerificationRequest } from '../../../store/actions';

import { ButtonsEl, PortalContainer } from '../../../elements';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

import { translateField } from '../../../shared/utils';

const closeIcon = `${UI_IMAGES_PATH}close.${UI_IMAGES_FORMAT}`;

export const Verification = ({ handleVerify, opened, registration = false, next = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const words = useSelector((state) => state.words);

  const regPhoneNumber = useSelector((state) => state.authorization.form.regPhoneNumber);
  const token = localStorage.getItem('user-token');

  const verificationRef = useRef(null);

  const [preloader, setPreloader] = useState(false);
  const [showResendButton, setShowResendButton] = useState(false);
  const [showError, setShowError] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  // Events Verification
  const [verificationCode, setVerificationCode] = useState({
    field: handleVerify?.data ?? '',
    fieldValue: handleVerify?.value,
    result: handleVerify?.result ?? '',
    code: '',
    step: handleVerify?.step || 'start',
    error: '',
    deactive: handleVerify?.deactive,
  });

  const resetVerificationInput = () => {
    setVerificationCode((prevVerificationCode) => ({
      ...prevVerificationCode,
      code: '', // Сбрасываем значение в поле ввода
    }));
    // registration && setShowError(false); // Скрываем ошибку
  };

  const sendVerificationRequest = useCallback(
    (field) => {
      const register = registration
        ? // eslint-disable-next-line no-useless-escape
          dispatch(
            getVerificationRequest({
              cmd: 'activation',
              value: null,
              code: verificationCode?.code,
              // eslint-disable-next-line no-useless-escape
              phone: regPhoneNumber?.replace(/[\.\-\(\)/\\\s]/g, ''),
            }),
          )
        : dispatch(getVerificationRequest({ cmd: 'accountVerification', value: field, code: verificationCode?.code, phone: regPhoneNumber }));

      register
        .then((responseData) => {
          setPreloader(true);

          setTimeout(() => {
            setPreloader(false);
          }, 1000);

          setVerificationCode({ ...verificationCode, error: responseData.error, step: 'send', result: responseData.content.message });

          if (responseData.error)
            setTimeout(() => {
              setShowError(true);
              resetVerificationInput();
            }, 1000);

          if (registration && responseData.content.token) {
            localStorage.setItem('user-token', responseData.content.token);
            navigate('/');
          }

          if (responseData.content.message === 'code_is_send' || responseData.error === 'code_not_found') {
            setTimeout(() => {
              setPreloader(false);
            }, 10000);

            setTimeout(() => {
              setShowResendButton(true);
            }, 10000);
          }

          if (verificationCode?.code) {
            setVerificationCode((prevVerificationCode) => ({
              ...prevVerificationCode,
              result: 'finish',
            }));
          }
        })

        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error('Ошибка отправки запроса:', error);
        })

        .finally(() => {});
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [token, dispatch, verificationCode, showResendButton, preloader],
  );

  const sendFieldVerificationRequest = useCallback((field) => {
    setVerificationCode((prevVerificationCode) => ({
      ...prevVerificationCode,
      step: 'send',
      field,
    }));
  }, []);

  useEffect(() => {
    setVerificationCode((prevCode) => ({
      ...prevCode,
      field: handleVerify?.data || '',
      fieldValue: handleVerify?.value || '',
      deactive: handleVerify?.deactive || false,
    }));
  }, [handleVerify?.data, handleVerify]);

  const resetVerificationForm = useCallback(() => {
    setVerificationCode({
      field: '',
      fieldValue: '',
      result: '',
      code: '',
      step: 'start',
      error: '',
    });
  }, []);

  useEffect(() => {
    if (verificationCode.result === 'finish' && !verificationCode.error) {
      setTimeout(() => {
        resetVerificationForm();
        opened(true);
        dispatch({
          type: 'SIGNUP_PHONE_NUMBER',
          payload: undefined,
        });
      }, 2000);
    }
  }, [verificationCode.result, verificationCode.error, resetVerificationForm, opened, dispatch]);

  const handleClose = useCallback(() => {
    opened();
    resetVerificationForm();
    // if (verificationCode.result === 'final' || verificationCode.error === 'value_is_verificated' || verificationCode.error === 'value_is_fail') {
    //   resetVerificationForm();
    // }
  }, [opened, resetVerificationForm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (verificationRef.current && !verificationRef.current.contains(event.target)) {
        handleClose();
      }
    }

    !registration && document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (verificationCode.error && verificationCode?.error?.startsWith('next_code_after:')) {
      const timeInSeconds = parseInt(verificationCode.error.split(':')[1], 10);
      setRemainingTime(timeInSeconds);

      const countdownInterval = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 1) {
            clearInterval(countdownInterval);
            setShowResendButton(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setRemainingTime(0);
      setShowResendButton(false);
    }
  }, [verificationCode.error]);

  const verificationPopup = useMemo(() => {
    const { field, fieldValue, step, result, code, error, deactive } = verificationCode;
    let subtitle;
    let infoSendCode;
    let errorResult;
    let resultVerification;
    let buttonTitle;

    const disable = code?.length < 4 || code?.length > 12 || code === '0' || (result === 'finish' && !error) ? true : false;

    if (!error?.startsWith('next_code_after')) {
      switch (error) {
        case 'code_not_found':
          errorResult = next ? translateField('error_field_format', 'auth.error', words, false) : translateField('code_not_found', 'auth.error', words, false);
          break;
        case 'value_is_verificated':
          errorResult = `${translateField('value_is_verificated', 'auth.error', words, false)} ${field}`;
          break;
        case 'value_is_fail':
          errorResult = `${translateField('value_is_fail', 'auth.error', words, false)} ${field}`;
          break;
        case 'value_is_empty':
          errorResult = translateField('value_is_fail', 'auth.error', words, false);
          break;
        default:
          errorResult = translateField(error, 'auth.error', words, false);
          break;
      }
    }

    switch (field) {
      case 'email':
        subtitle = `${translateField('enter_code_is_send_email', 'auth.message', words, false)} ${fieldValue ? fieldValue : ''}:`;
        break;
      case 'phone':
        subtitle = `${translateField('enter_code_is_send_phone', 'auth.message', words, false)}`;
        break;
      default:
        subtitle = translateField('enter_field_verify', 'auth.message', words, false);
        break;
    }
    switch (`${step},${field}`) {
      case 'start,email':
        infoSendCode = `${translateField('sending_code_for_you_email', 'auth.message', words, false)}. ${fieldValue ? fieldValue : ''}`;
        buttonTitle = `${translateField('code_send', 'auth.message', words, false)}`;
        break;
      case 'start,phone':
        infoSendCode = `${translateField('sending_code_for_you_phone', 'auth.message', words, false)}. ${fieldValue ? fieldValue : ''}`;
        buttonTitle = `${translateField('code_send', 'auth.message', words, false)}`;
        break;
      case 'start,pay_id_number':
        infoSendCode = `${translateField('sending_code_for_you', 'auth.message', words, false)} ${fieldValue ? fieldValue.replace(/[^\w\s]/gi, ' ') : ''}`;
        buttonTitle = `${translateField('next', 'auth.message', words, false)}`;
        break;

      default:
        infoSendCode = `${translateField('enter_code_check', 'auth.message', words, false)} ${field}`;
        buttonTitle = `${translateField('code_send', 'auth.message', words, false)}`;
        break;
    }

    switch (result) {
      case 'code_is_send':
        resultVerification = translateField('code_is_send', 'auth.message', words, false);
        break;
      default:
        break;
    }

    const sendCode = (
      <div className="verification-action">
        <ButtonsEl
          className="button--verification button--verification-send"
          onClick={() => {
            if (next) sendFieldVerificationRequest(field);
            else {
              if (registration) disable && sendVerificationRequest(field);
              else sendVerificationRequest(field);
            }
          }}
        >
          {buttonTitle}
        </ButtonsEl>
      </div>
    );

    const requestCode = (
      <div className="verification-action">
        <input
          type="text"
          className="verification-input"
          value={verificationCode.code}
          onChange={(e) => {
            setVerificationCode({ ...verificationCode, code: e.target.value });
            setShowError(false);
          }}
          onClick={() => error && setShowError(false)}
          placeholder={translateField(next ? `verify_${field}` : 'verify_enter_code', 'auth.message', words, false)}
          disabled={(result === 'finish' && !error) || error === 'value_is_fail' || error === 'value_is_verificated' ? true : false}
        />
        <ButtonsEl
          className="button--verification button--verification-send"
          onClick={() => {
            !disable && sendVerificationRequest(field);
          }}
          disabled={disable ? true : false}
          loading={preloader}
        >
          {translateField(next ? 'send_field' : 'code_confirm', 'auth.message', words, false)}
        </ButtonsEl>
      </div>
    );

    const verificationStep = (step) => {
      return (
        <Fragment>
          <div className="verification-event">
            <div className="verification-subtitle">
              {step === 'start' && infoSendCode}
              {step === 'send' && subtitle}
            </div>
          </div>
          {step === 'start' && sendCode}
          {step === 'send' && requestCode}
          <div className="verification-status">
            {!showResendButton && result === 'code_is_send' && <span className="send">{resultVerification}</span>}
            {showResendButton && result === 'code_is_send' && !registration && (
              <div
                className="resend-code"
                onClick={() => {
                  sendVerificationRequest(field);
                  setShowResendButton(false);
                }}
              >
                {translateField('code_send_again', 'auth.message', words, false)}
              </div>
            )}
            {error && showError && <span className="error">{errorResult}</span>}
            {result === 'finish' && !error && (
              <span className="send">
                {translateField('verify_success_ty', 'auth.message', words, false)}, {field} {translateField('verify_success', 'auth.message', words, false)}!
              </span>
            )}
            {remainingTime > 0 && (
              <span className="remaining-time">
                {translateField('code_send_again_after', 'auth.message', words, false)} {remainingTime} {translateField('second', 'basic', words, false)}
              </span>
            )}
          </div>
        </Fragment>
      );
    };

    return !registration ? (
      <PortalContainer className="verification-modal" id="verification-modal">
        <div className="verification">
          <div className="verification-content" ref={verificationRef} key={`${verificationCode?.field}_verification-content`}>
            <div className="verification-title">
              {deactive ? (
                <span>{translateField('request_save_account_information_title', 'auth.verify', words, false)}</span>
              ) : (
                <span>{`${translateField(next ? 'verify_field_send' : 'code_send_again_after', 'auth.verify', words, false)} ${translateField(
                  field,
                  'auth.input',
                  words,
                )?.toLowerCase()}`}</span>
              )}

              <ReactInlineSvg
                key="close-icon-2"
                cacheRequests
                uniqueHash="a1f8d1"
                uniquifyIDs={true}
                src={closeIcon}
                title="account-active-close-active"
                description="account_active_close-deactive-profile"
                className="close"
                onClick={handleClose}
              />
            </div>

            {deactive ? (
              <div className="verification-event">
                <div className="verification-subtitle">{translateField('request_save_account_information_description', 'auth.verify', words, false)}</div>
              </div>
            ) : (
              verificationStep(step)
            )}
          </div>
        </div>
      </PortalContainer>
    ) : (
      <div className="verification in-page">
        <div className="verification-content" ref={verificationRef}>
          {verificationStep(step)}
        </div>
      </div>
    );
  }, [verificationCode, next, words, preloader, registration, handleClose, sendFieldVerificationRequest, sendVerificationRequest, showResendButton, showError, remainingTime]);

  if (!handleVerify?.open) return null;

  return verificationPopup;
};
