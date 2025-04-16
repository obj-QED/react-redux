import React, { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorsMain } from '../../../elements';
import { Notification, AnimatedPreloader } from '../../../components';

import { setCurrentStepForm, hiddenAuthSocial } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { useRegistrationSubmitStep } from '../_events/useAuthSubmit';

import Form from '../_path/_Form';

const RegistrationSteps = memo(() => {
  const dispatch = useDispatch();
  const handleRegistrationSubmit = useRegistrationSubmitStep();

  const words = useSelector((state) => state.words);
  const form = useSelector((state) => state.authorization.form);
  const thisForm = form.registrationSteps;
  const fields = thisForm?.values;

  const [lastData, setLastData] = useState({});
  const [currentStep, setCurrentStep] = useState(thisForm?.steps[0]);
  const [messageForm, setMessageForm] = useState(null);
  const [showPreloader, setShowPreloader] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const preloader = useMemo(
    () => (
      <div className="form-preloader form-preloader_auth">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  useEffect(() => {
    if (currentStep) {
      dispatch(setCurrentStepForm({ step_registration_steps: `registration_steps_${currentStep}` }));
    }

    return () => {
      dispatch(setCurrentStepForm({ step_registration_steps: undefined }));
    };
  }, [currentStep, dispatch]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'SIGNUP_PHONE_NUMBER',
        payload: undefined,
      });
      dispatch({
        type: 'HIDDEN_AUTH_SOCIAL',
        payload: undefined,
      });
    };
  }, [dispatch]);

  const handleSetMessage = useCallback(({ message, className, loader = false }) => {
    if (loader) {
      setShowPreloader(true);
      setTimeout(() => {
        setShowPreloader(false);
      }, 1000);
    }

    setMessageForm(null);
    setMessageForm({ message, className, key: Date.now() });
  }, []);

  const handleRegistationStepsSuccess = useCallback(
    (responseData) => {
      const phoneValue = responseData?.phone;
      const otpCode = responseData?.otpCode;
      // const phoneValue = responseData?.phone;
      if (phoneValue && !otpCode) {
        setLastData({ phone: phoneValue });
      } else if (phoneValue && otpCode) {
        setLastData({ phone: phoneValue, otpCode: otpCode });
      }

      const MESSAGE = responseData?.content?.message;
      const stepSuccess = MESSAGE && responseData?.content?.length !== 0 && !responseData.error;

      if (currentStep === thisForm?.steps[0] && stepSuccess) {
        setImageLoaded(false);
        handleSetMessage({ message: MESSAGE, className: 'ant-notification-notice-success', loader: true });

        setCurrentStep(thisForm?.steps[1]);
        dispatch(hiddenAuthSocial(true));
      } else if (currentStep === thisForm?.steps[1] && stepSuccess) {
        setImageLoaded(false);

        handleSetMessage({ message: 'accepted_code', className: 'ant-notification-notice-success', loader: true });
        setCurrentStep(thisForm?.steps[2]);
        MESSAGE === 'form' ? setCurrentStep(thisForm?.steps[2]) : setCurrentStep(thisForm?.steps[3]);
      } else if (currentStep === thisForm?.steps[2] && stepSuccess) {
        handleSetMessage({ message: 'account_update', className: 'ant-notification-notice-success', loader: true });
        setCurrentStep(thisForm?.steps[4]);
      }
    },
    [currentStep, thisForm?.steps, dispatch, handleSetMessage],
  );

  const handleRegistrationStepsError = useCallback(
    (error) => {
      if (error === 'timer_wa') return;
      if (error && typeof error === 'object') {
        error = Object.entries(error)
          .map(([key, value]) => `${translateField(key, 'form', words, false)} ${translateField(value, 'form', words, false)}`)
          .join('<br />');
        handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
      } else if (error && typeof error === 'string') {
        handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
      } else if (error && typeof error === 'number') {
        const currentTime = new Date().getTime(); // Текущее время в миллисекундах
        const countdown = error; // Количество секунд для отсчета
        const endTime = currentTime + countdown * 1000; // Время окончания таймера
        localStorage.setItem('send-again-submit', endTime);
        localStorage.setItem('send-again-form-id', `registration_steps_${currentStep}`);
      }
    },
    [currentStep, handleSetMessage, words],
  );

  const errorRender = useMemo(() => {
    return (
      <ErrorsMain
        errorMessages={['Sorry this form is disabled, please contact the administrator.']}
        styled="block"
        position="center"
        translate={false}
        className="auth-form__message"
      />
    );
  }, []);

  const customFields = useMemo(() => {
    const field_phone = { id: 'phone', require: 1 };
    const field_code = [
      { id: 'code', require: 1 },
      // { id: 'new_password', require: 1 },
    ];
    const fields_default = fields;

    return { field_phone, field_code, fields_default };
  }, [fields]);

  const regStepForm = useMemo(() => {
    if (!fields?.length || !customFields.field_phone) {
      return;
    }
    if (currentStep === thisForm?.steps[0]) {
      const fields = [customFields.field_phone];
      return (
        <Form
          formId={`registration_steps_${currentStep}`}
          fields={{ fields: fields, label: true }}
          event={handleRegistrationSubmit}
          onSuccess={handleRegistationStepsSuccess}
          onError={handleRegistrationStepsError}
          messageError={false}
          button={{
            type: 'submit',
            name: 'send_code',
          }}
          showCountdown
        />
      );
    } else if (currentStep === thisForm?.steps[1]) {
      const fields = [{ ...customFields.field_phone, disabled: true, defaultValue: lastData?.phone?.replace(/\D/g, '') }, ...customFields.field_code];
      return (
        <Form
          formId={`registration_steps_${currentStep}`}
          fields={{ fields: fields, label: true }}
          event={handleRegistrationSubmit}
          onSuccess={handleRegistationStepsSuccess}
          onError={handleRegistrationStepsError}
          messageError={false}
          button={{
            type: 'submit',
            name: 'confirm',
          }}
        />
      );
    } else if (currentStep === thisForm?.steps[2]) {
      return (
        <Form
          formId={`registration_steps_${currentStep}`}
          fields={{ fields: customFields?.fields_default, label: true }}
          event={(event) => handleRegistrationSubmit(event, lastData)}
          onSuccess={handleRegistationStepsSuccess}
          onError={handleRegistrationStepsError}
          messageError={false}
          button={{
            type: 'submit',
            name: 'save_simple',
          }}
          resetForm
        />
      );
    } else if (currentStep === thisForm?.steps[3]) {
      return <div className="auth-form__message">{translateField('activate_registration_phone', 'auth', words, false)}</div>;
    } else if (currentStep === thisForm?.steps[4]) {
      return <div className="auth-form__message">{translateField('profile_info_update', 'auth', words, false)}</div>;
    }
  }, [customFields, currentStep, fields, thisForm?.steps, handleRegistrationStepsError, handleRegistrationSubmit, handleRegistationStepsSuccess, lastData, words]);

  const squareImage = useMemo(() => {
    return (
      <Fragment>
        {!imageLoaded && !showPreloader && (
          <div
            className="form-preloader form-preloader_auth"
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 5,
              background: 'var(--auth-forms-bg)',
            }}
          >
            <AnimatedPreloader />
          </div>
        )}
        <div className="square-image-container">
          <img
            className="square-image"
            src="/logo3.webp"
            alt="logo-form-otpCode"
            width="100%"
            heigth="100%"
            onLoad={(e) => {
              setImageLoaded(true);
              const element = e.target;
              const parentElement = element?.parentNode;

              if (parentElement) {
                parentElement.style.display = 'block';
              }
            }}
            onError={(e) => {
              e.target.onerror = null;
              setImageLoaded(true);

              const element = e.target;
              const parentElement = element?.parentNode;

              if (parentElement) {
                parentElement.style.display = 'none';
              }
            }}
          />
        </div>
      </Fragment>
    );
  }, [imageLoaded, showPreloader]);

  if (!regStepForm) return errorRender;

  return (
    <Fragment>
      {showPreloader ? (
        preloader
      ) : (
        <Fragment>
          {(currentStep === thisForm?.steps[0] || currentStep === thisForm?.steps[1]) && squareImage}
          <div className="social-custom-form" key={currentStep}>
            {/* {currentStep && <div className="social-custom-form_title">{translateField(currentStep, 'auth.input', words, false)}</div>} */}
            <div className="social-custom-form_content">{regStepForm}</div>
            {messageForm && form?.message && (
              <Notification duration={5} errorResponse={{ message: translateField(messageForm?.message, 'auth', words, false), className: messageForm?.className }} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
});

export default RegistrationSteps;
