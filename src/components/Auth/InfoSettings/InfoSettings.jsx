// eslint-disable-next-line no-unused-vars
import React, { useMemo, useState, useEffect, useCallback, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReactInlineSvg from 'react-inlinesvg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Notification } from '../../../components';
import { ControllerForm, ButtonsEl } from '../../../elements/';

import { settingsSchema } from '../../../schemas/settingsSchema';
import { translateField } from '../../../shared/utils';
import { useSkipInitialEffect } from '../../../hooks/useSkipInitialEffect';
import { profileResetPassword } from '../../../store/actions';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

const initialDataForm = {
  oldPassword: {
    type: 'password',
    label: 'Old password',
    placeholder: 'Old password',
  },
  newPassword: {
    type: 'password',
    label: 'New password',
    placeholder: 'New password',
  },
  repeatPassword: {
    type: 'password',
    label: 'Repeat new password',
    placeholder: 'Repeat new password',
  },
};

const verifyIcon = `${UI_IMAGES_PATH}check-circle.${UI_IMAGES_FORMAT}`;

export const InfoSettings = () => {
  const dispatch = useDispatch();

  const [formStatus, setFormStatus] = useState('update_password');
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    getValues,
    setError,
    formState: { errors, isValid },
  } = useForm({ resolver: yupResolver(settingsSchema), mode: 'onChange' });
  const words = useSelector((state) => state.words);
  const resetPassword = useSelector((state) => state.account?.resetPassword);

  const errorResult = resetPassword?.error;
  const resultMessage = resetPassword?.message;

  const password = watch('newPassword');

  useSkipInitialEffect(() => {
    password && trigger('repeatPassword');
  }, [password, trigger]);

  const onSubmit = useCallback(async () => {
    const oldPassword = getValues('oldPassword');
    const newPassword = getValues('newPassword');
    if (oldPassword === newPassword) {
      setError('newPassword', { type: 'manual', message: 'passwords_should_not_match' });
      return;
    }

    try {
      setFormStatus('sending');
      setLoading(true);
      await dispatch(profileResetPassword({ data: { password: [getValues('oldPassword'), getValues('newPassword')] } }));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Form submission error:', error);
    } finally {
      reset();
      setLoading(false);
      setFormStatus('update_password');
    }
  }, [dispatch, getValues, reset, setError]);

  const buttonStatus = useMemo(() => {
    switch (formStatus) {
      case 'sending':
        return translateField('change_data', 'auth.button', words);
      case 'ready':
        return translateField('ready', 'auth.button', words);
      case 'error':
        return translateField('error', 'auth.button', words);
      default:
        return translateField('update_password', 'auth.button', words);
    }
  }, [formStatus, words]);

  const notificationParams = useMemo(() => {
    if (resultMessage) {
      return {
        status: true,
        message: translateField(resultMessage, 'auth.success', words, false),
        className: 'ant-notification-notice-success',
        icon: (
          <ReactInlineSvg
            className="icon"
            src={verifyIcon}
            title="reset password success"
            width="25"
            height="25"
            preProcessor={(code) => code.replace(/fill=".*?"/g, 'fill="#d3ffc9"')}
            cacheRequests
          />
        ),
      };
    } else if (errorResult) {
      return {
        status: true,
        message: translateField(errorResult, 'auth.error', words, false),
        className: 'ant-notification-notice-error',
      };
    } else {
      return { status: false };
    }
  }, [resultMessage, errorResult, words]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form profile-form profile-form_reset-password" data-hj-suppress>
      {Object.entries(initialDataForm).map(([id, index]) => (
        <div key={`${id}_${index}`} className="auth-form_field">
          <ControllerForm
            fieldType="inputPassword"
            classNameInput="auth-form_field-input"
            errors={errors}
            name={id}
            control={control}
            placeholder={translateField(initialDataForm[id]?.placeholder.toLowerCase().replace(/ /g, '_'), 'auth.input', words, false)}
          />
        </div>
      ))}

      <ButtonsEl type="submit" disabled={!isValid} loading={loading} className="auth-form_events submit">
        {buttonStatus}
      </ButtonsEl>

      {notificationParams?.status && (
        <Notification
          duration={8}
          errorResponse={{
            message: notificationParams?.message,
            className: notificationParams?.className,
            icon: notificationParams?.icon,
          }}
        />
      )}
    </form>
  );
};
