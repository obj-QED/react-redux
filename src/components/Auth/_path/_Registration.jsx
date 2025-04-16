import React, { Fragment, memo, useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Notification } from '../../../components';

import { setCurrentStepForm } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { useRegistrationSubmit } from '../_events/useAuthSubmit';

import Form from './_Form';

const Registration = memo(({ formId, eventSuccess, step, values }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.authorization.form);
  const words = useSelector((state) => state.words);
  const settings = useSelector((state) => state.settings);
  const emailTerms = settings?.emailTerms ?? false;
  const supportTerms = settings?.supportTerms ?? false;

  const [messageForm, setMessageForm] = useState(null);

  const handleRegistrationSubmit = useRegistrationSubmit();

  useEffect(() => {
    if (step) dispatch(setCurrentStepForm({ step_registration: `registration_${step}` }));
    return () => {
      dispatch(setCurrentStepForm({ step_registration: undefined }));
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
    <Fragment key={formId}>
      <Form
        formId={formId}
        event={handleRegistrationSubmit}
        button={{
          type: 'submit',
          name: 'registration',
        }}
        fields={{ fields: values, label: true }}
        termsChecked={true}
        otherTermsChecked={emailTerms ? true : false}
        supportTermsChecked={supportTerms ? true : false}
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

export default Registration;
