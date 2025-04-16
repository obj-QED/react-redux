import React, { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Notification } from '../../../components';
import { ErrorsMain } from '../../../elements';

import { setActiveForm, setCurrentStepForm } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { useForgotSubmit } from '../_events/useAuthSubmit';

import Form from '../_path/_Form';

const Forgot = memo(() => {
  const dispatch = useDispatch();
  const handleForgotSubmit = useForgotSubmit();

  const words = useSelector((state) => state.words);
  const form = useSelector((state) => state.authorization.form);
  const forgot = form?.forgot;

  const passwordResetArray = useSelector((state) => state.api.passwordReset);

  const [currentStep, setCurrentStep] = useState(forgot?.steps[0]);
  const [mode, setMode] = useState(null);
  const [messageForm, setMessageForm] = useState(null);

  const [lastData, setLastData] = useState({}); // State to store data from previous steps

  const handleMode = useCallback(
    (mode) => {
      setMode(mode);
      setCurrentStep(forgot?.steps[1]);
    },
    [forgot],
  );

  useEffect(() => {
    dispatch(setActiveForm('forgot_password'));
  }, [dispatch]);

  useEffect(() => {
    if (currentStep) {
      dispatch(setCurrentStepForm({ step_forgot: `forgot_${currentStep}` }));
    }

    return () => {
      if (!currentStep) {
        dispatch(setCurrentStepForm({ step_forgot: undefined }));
      }
    };
  }, [currentStep, dispatch]);

  const handleSetMessage = useCallback(({ message, className }) => {
    setMessageForm(null);
    setMessageForm({ message, className, key: Date.now() });
  }, []);

  const handleForgotSuccess = useCallback(
    (responseData) => {
      const data = mode && responseData[mode] ? { [mode]: responseData[mode] } : responseData;
      setLastData(data);

      const step_1_success = responseData?.content && responseData?.content?.message && responseData?.content?.length !== 0 && !responseData.error;
      const step_2_success = responseData?.content && responseData?.content?.length === 0 && !responseData.error;
      const message = responseData?.content?.message;

      if (step_1_success) handleSetMessage({ message: message, className: 'ant-notification-notice-success' });
      if (step_2_success) handleSetMessage({ message: 'password_changed', className: 'ant-notification-notice-success' });

      if (currentStep === forgot?.steps[1]) {
        setCurrentStep(forgot?.steps[2]);
      } else if (currentStep === forgot?.steps[2]) {
        setCurrentStep(forgot?.steps[3]);
      }
    },
    [currentStep, forgot?.steps, mode, handleSetMessage],
  );

  const handleForgotError = useCallback(
    (error) => {
      if (error) {
        handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
      }
    },
    [handleSetMessage],
  );

  const forgotForm = useMemo(() => {
    if (currentStep === forgot?.steps[0]) {
      return (
        <div className="auth-form_buttons">
          {passwordResetArray?.map((item) => (
            <button className="auth-form_events submit" onClick={() => handleMode(item)}>
              {translateField(`reset_with_${item}`, 'auth', words)}
            </button>
          ))}
        </div>
      );
    } else if (currentStep === forgot?.steps[1]) {
      const field = forgot?.fields.find((item) => item.id === mode);
      return (
        <Form
          formId={`forgot_${forgot?.steps[1]}`}
          fields={[field]}
          event={(data) => handleForgotSubmit(data, lastData && lastData)}
          onSuccess={handleForgotSuccess}
          onError={handleForgotError}
          messageError={false}
          button={{
            type: 'submit',
            name: 'send_code',
          }}
        />
      );
    } else if (currentStep === forgot?.steps[2]) {
      const codeField = forgot?.fields?.find((item) => item?.id === 'code');
      const passwordField = forgot?.fields.find((item) => item.id === 'new_password');
      return (
        <Form
          formId={`forgot_${forgot?.steps[2]}`}
          fields={[codeField, passwordField]}
          event={(data) => handleForgotSubmit(data, lastData && lastData)}
          onSuccess={handleForgotSuccess}
          onError={handleForgotError}
          messageError={false}
          button={{
            type: 'submit',
            name: 'confirm',
          }}
        />
      );
    } else if (currentStep === forgot?.steps[3]) {
      return <div className="auth-form__message">{translateField('password_change', 'auth', words, false)}</div>;
    }
  }, [currentStep, mode, forgot, handleMode, handleForgotSubmit, handleForgotSuccess, handleForgotError, lastData, words, passwordResetArray]);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'PASSWORD_RESET_ERROR',
        payload: null,
      });
      dispatch({
        type: 'PASSWORD_RESET_ADD',
        payload: null,
      });
    };
  }, [dispatch]);

  if (!passwordResetArray?.length)
    return (
      <ErrorsMain
        className="auth-form__message p-0"
        errorMessages={['Sorry this form is disabled, please contact the administrator.']}
        styled="inline"
        position="center"
        translate={false}
      />
    );

  return (
    <Fragment>
      {forgotForm}
      {messageForm && form?.message && (
        <Notification duration={5} errorResponse={{ message: translateField(messageForm?.message, 'auth', words, false), className: messageForm?.className }} />
      )}
    </Fragment>
  );
});

export default Forgot;
