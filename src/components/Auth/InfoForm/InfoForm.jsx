import React, { Fragment, useState, useCallback, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDeepCompareEffect } from 'use-deep-compare';

import ReactInlineSvg from 'react-inlinesvg';
import { ButtonsEl, ErrorsMain } from '../../../elements';
import { Verification, AnimatedPreloader, Notification } from '../../../components';

import { useCopyClipboard } from '../../../hooks';
import { authGetMessage } from '../../../store/actions';
import { translateField } from '../../../shared/utils';
import { ProfileSchema } from '../../../schemas/ProfileSchema';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

import { useProfileUpdate } from '../_events/useAuthSubmit';

import Form from '../_path/_Form';

const copyIcon = `${UI_IMAGES_PATH}copy.${UI_IMAGES_FORMAT}`;

const InfoForm = memo(() => {
  const dispatch = useDispatch();

  const replaceValueWithDefaultValue = useCallback((data) => {
    if (Array.isArray(data)) {
      return data.map(replaceValueWithDefaultValue);
    } else if (typeof data === 'object' && data !== null) {
      const newData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (key === 'value') {
            newData['defaultValue'] = replaceValueWithDefaultValue(data[key]);
          } else {
            newData[key] = replaceValueWithDefaultValue(data[key]);
          }
        }
      }
      return newData;
    }
    return data;
  }, []);

  const settings = useSelector((state) => state.settings);
  const words = useSelector((state) => state.words);
  const account = useSelector((state) => state.account);
  const init = useSelector((state) => state.api);
  const auth = useSelector((state) => state.authorization);

  const handleUpdateProfileSubmit = useProfileUpdate();

  const verificationLevel = account?.data?.verificationLevel;
  // const verificationLevel = 1;

  const [messageForm, setMessageForm] = useState(null);
  const [inputVerify, setInputVerify] = useState({});
  const [status, setStatus] = useState({
    message: 'save_simple',
    disabled: false,
    loading: false,
  });

  const getFieldInfo = (e, item, watch) => {
    e.preventDefault();

    setInputVerify({
      data: item?.id,
      value: watch,
      open: true,
      field: item.id,
      next: false,
      deactive: item?.defaultValue === '' ? true : false,
    });
  };

  const handleVerify = useCallback(
    (isVerify) => {
      setInputVerify({ ...inputVerify, open: false, result: isVerify });
    },
    [inputVerify],
  );

  const [copyFieldMessage, copyToClipboard] = useCopyClipboard();

  const onSuccess = useCallback(
    (data) => {
      if (!data) return;
      setStatus({
        message: 'success', // Text for success
        loading: false,
        disabled: true,
      });
      setMessageForm({
        message: 'success',
        className: 'ant-notification-notice-success',
        key: Date.now(),
      });

      setTimeout(() => {
        setStatus({
          message: 'save_simple', // Reset to default after a delay
          loading: false,
          disabled: false,
        });
        dispatch(authGetMessage(undefined));
      }, 2000);
    },
    [dispatch],
  );
  const formatErrorMessage = (error) => {
    if (!error) return 'Unknown error';
    if (typeof error === 'string') return error;
    if (Array.isArray(error)) return error.join(', ');
    if (typeof error === 'object') {
      const errorMessages = Object.entries(error)
        .map(([key, value]) => `${translateField(key, 'form', words, false)} ${translateField(value, 'form', words, false)}`)
        .join('<br />');
      return String(errorMessages);
    }
    return String(error);
  };

  const onError = useCallback(
    (error) => {
      setStatus({
        message: 'error', // Text for failure
        loading: false,
        disabled: true,
      });

      setMessageForm({
        message: error,
        className: 'ant-notification-notice-error',
        key: Date.now(),
      });

      setTimeout(() => {
        setStatus({
          message: 'save_simple', // Reset to default after a delay
          loading: false,
          disabled: false,
        });
        dispatch(authGetMessage(undefined));
      }, 2000);
    },
    [dispatch],
  );

  const handleSubmit = async (formData) => {
    setStatus({
      message: 'processing',
      loading: true,
      disabled: true,
    });
    try {
      const response = await handleUpdateProfileSubmit(formData);
      if (response?.error) {
        throw new Error(formatErrorMessage(response.error));
      } else onSuccess(response);
    } catch (error) {
      onError(error.message || 'Unknown error');
    }
  };

  const preloader = useMemo(
    () => (
      <div className="form-preloader form-preloader_profile">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  const errorRender = useMemo(() => {
    return <ErrorsMain errorMessages={['Sorry this form is disabled, please contact the administrator.']} styled="block" position="center" translate={false} />;
  }, []);

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useDeepCompareEffect(() => {
    if (account?.profile) {
      const transformedData = replaceValueWithDefaultValue(account.profile);

      setForm(transformedData);
      setLoading(false);

      if (transformedData?.length === 0) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setForm(null);
      setLoading(true);
      setError(false);
    }
  }, [account?.profile, replaceValueWithDefaultValue]);

  if (!account?.loading) {
    return preloader;
  }

  if (account?.loading && error) {
    return errorRender;
  }

  return (
    <Fragment>
      {form && form.length > 0 && (
        <Fragment>
          <div className="form-info-users">
            <Form
              key={JSON.stringify(form)}
              className="profile-form"
              formId="profile-form"
              fields={{ fields: form, className: 'auth-form_field_path', label: true }}
              event={(event) => {
                const updatedEvent = { ...event };

                Object.keys(updatedEvent).forEach((key) => {
                  if (updatedEvent[key] === undefined) {
                    const field = form.find((field) => field.id === key);
                    if (field && field.defaultValue !== undefined) {
                      updatedEvent[key] = field.defaultValue;
                    }
                  }
                });

                return handleSubmit(updatedEvent);
              }}
              eventNullData={true}
              onSuccess={onSuccess}
              onError={onError}
              messageError={false}
              button={{
                type: 'submit',
                name: status?.message, // Button text based on status
                loading: status?.loading ? true : false,
                disabled: status?.disabled,
              }}
              verification={{
                verificationLevel: Boolean(Number(verificationLevel)),
              }}
              handleVerify={getFieldInfo}
              schemaForm={ProfileSchema}

              // masonry
            />
          </div>
          {settings?.verify_docs_email?.docs_email && !verificationLevel && (
            <div className="verify-docs">
              <div className="info-title">{translateField('verify_docs_title', 'balance.wallet', words)}</div>
              <p className="info-text">
                <span className="first-info">{translateField('verify_docs_description', 'balance.wallet', words)}</span>
              </p>
              <div className="events-buttons">
                <ButtonsEl
                  className="button--verification"
                  onClick={() => {
                    if (settings?.verify_docs_email) window.location.href = `mailto:${settings?.verify_docs_email}`;
                  }}
                >
                  {translateField('verify_docs_email', 'balance.wallet', words)}
                </ButtonsEl>
                <div className="email-field" onClick={() => copyToClipboard('verify_docs')}>
                  <input className="email" id="verify_docs" value={settings?.verify_docs_email?.docs_email} readOnly />
                  <span className="copy-clipboard-button">
                    <ReactInlineSvg src={copyIcon} title="copy" cacheRequests />
                    {copyFieldMessage['verify_docs'] && (
                      <div className="copy-clipboard-button_message">{translateField(copyFieldMessage['verify_docs'], 'basic', words, false)}</div>
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
      <Verification handleVerify={inputVerify} opened={handleVerify} next={inputVerify.next} />

      {messageForm && auth?.form?.message && (
        <Notification
          key={messageForm.key}
          duration={5}
          errorResponse={{ message: translateField(messageForm?.message, 'auth', words, false), className: messageForm?.className }}
        />
      )}
    </Fragment>
  );
});

export default InfoForm;
