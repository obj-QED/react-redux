import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ErrorsMain } from '../../../elements';

import { translateField } from '../../../shared/utils';
import { Verification } from '../Verification/Verification';

export const Success = () => {
  const dispatch = useDispatch();
  const activationAccount = useSelector((state) => state.authorization.form.activationAccount);
  const words = useSelector((state) => state.words);

  useEffect(() => {
    return () => {
      dispatch({
        type: 'SIGNUP_TYPE_ACTIVATION',
        payload: undefined,
      });
      dispatch({
        type: 'SET_ACTIVE_ACCOUNT',
        payload: undefined,
      });
      dispatch({
        type: 'SIGNUP_PHONE_NUMBER',
        payload: undefined,
      });
    };
  }, [dispatch]);

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

  const renderContent = useMemo(() => {
    if (activationAccount === 'email') return <div className="auth-form__message">{translateField('check_your_email', 'auth.message', words, false)}</div>;
    else if (activationAccount === 'phone')
      return (
        <div className="auth-form__message">
          <Verification registration handleVerify={{ data: 'phone', step: 'send', fieldValue: null, open: true }} />
        </div>
      );
    else return errorRender;
  }, [words, activationAccount, errorRender]);

  return (
    <div className="auth-form">
      <div className="auth-auth-form_container">{renderContent}</div>
    </div>
  );
};
