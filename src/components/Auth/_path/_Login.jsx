import React, { Fragment, memo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Notification } from '../../../components';

import { setCurrentStepForm } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { useLoginSubmit } from '../_events/useAuthSubmit';

import Form from './_Form';

const Login = memo(({ formId, eventSuccess, values, step }) => {
  const handleLoginSubmit = useLoginSubmit();
  const dispatch = useDispatch();

  const form = useSelector((state) => state.authorization.form);
  const words = useSelector((state) => state.words);

  const [messageForm, setMessageForm] = useState(null);

  useEffect(() => {
    if (step) {
      dispatch(setCurrentStepForm({ step_signIn: `login_${step}` }));
    }
    return () => {
      dispatch(setCurrentStepForm({ step_signIn: undefined }));
    };
  }, [dispatch, step]);

  const handleSetMessage = useCallback(({ message, className }) => {
    setMessageForm(null);
    setMessageForm({ message, className, key: Date.now() });
  }, []);

  const handleLoginError = useCallback(
    (error) => {
      if (error === 'object' && error === 'timer_wa') return;
      else if (error && typeof error === 'object') {
        error = Object.entries(error)
          .map(([key, value]) => `${translateField(key, 'form', words, false)} ${translateField(value, 'form', words, false)}`)
          .join('<br />');
        handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
      } else if (error && typeof error === 'string') {
        handleSetMessage({ message: error, className: 'ant-notification-notice-error' });
      }
    },
    [handleSetMessage, words],
  );

  return (
    <Fragment>
      <Form
        formId={formId}
        fields={values}
        event={handleLoginSubmit}
        button={{
          type: 'submit',
          name: 'login_button',
        }}
        onSuccess={eventSuccess}
        onError={handleLoginError}
        messageError={messageForm ? false : true}
      />
      {((messageForm && form?.message) || (form?.message && form?.socialMessage)) && (
        <Notification
          duration={form?.message && form?.socialMessage ? 10 : 5}
          errorResponse={{
            message: translateField(messageForm?.message ?? form?.socialMessage, 'auth', words, false),
            className: messageForm?.className ? messageForm?.className : form?.socialMessage && 'ant-notification-notice-info',
          }}
        />
      )}
    </Fragment>
  );
});

export default Login;
