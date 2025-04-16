import React, { Fragment, useEffect, useState, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';
import ReactInlineSvg from 'react-inlinesvg';

import { useNavigate } from 'react-router-dom';
import { ButtonTypes } from '../../elements';
import { GoogleReCaptcha } from '../../elements/GoogleReCaptcha/GoogleReCaptcha';
import { translateField } from '../../shared/utils';

import { setActiveForm, setActivateAccount } from '../../store/actions';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';
import { default as AuthLogin } from './LoginForm/AuthLogin';
import { default as ForgotPassword } from './ForgotPassword/ForgotPassword';
import { default as SignUpForm } from './SignUpForm/AuthRegistration';

import { Success } from './Success/Success';

import './_Auth_custom.scss';

const arrowLeft = `${UI_IMAGES_PATH}arrow-small-left.${UI_IMAGES_FORMAT}`;

export const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const settings = useSelector((state) => state.settings);
  const size = useSelector((state) => state.handling.size);
  const lang = useSelector((state) => state.api.language);
  const words = useSelector((state) => state.words);
  const googleCaptchaToken = useSelector((state) => state.api?.modules?.googleCaptcha);

  const forms = useSelector((state) => state.authorization.form);
  const signInRequired = Boolean(Number(forms.signInRequired));

  const authFormType = forms?.activeForm; // Set default form type
  const signUpData = forms?.registration;
  const authFormLogo = settings?.authFormLogo || '/logo2.png';

  const [visibleBanner, setVisibleBanner] = useState(true);

  const getAuthFormType = useMemo(() => {
    if (signInRequired) return 'login';
    if (signUpData) return 'registration';
    else return 'login';
  }, [signInRequired, signUpData]);

  useEffect(() => {
    if (!forms?.activeForm) {
      const formType = getAuthFormType;
      dispatch(setActiveForm(formType));
    }
  }, [dispatch, forms?.activeForm, getAuthFormType]);

  useEffect(() => {
    localStorage.setItem('activeForm', authFormType);
    if (googleCaptchaToken) localStorage.setItem('googleCaptchaToken', googleCaptchaToken);
    return () => {
      localStorage.removeItem('activeForm');
    };
  }, [authFormType, googleCaptchaToken, dispatch]);

  const renderForm = useCallback(
    (type) => {
      switch (type) {
        // case 'login':
        // return <AuthLogin />;
        case 'registration':
          if (signUpData)
            return googleCaptchaToken ? (
              <Fragment>
                <GoogleReCaptcha>
                  <SignUpForm />
                </GoogleReCaptcha>
              </Fragment>
            ) : (
              <SignUpForm />
            );
          else return <AuthLogin />;

        case 'forgot_password':
          return <ForgotPassword />;
        case 'success':
          return <Success />;
        default:
          return <AuthLogin />;
      }
    },
    [signUpData, googleCaptchaToken],
  );

  const title = useMemo(() => {
    if (authFormType === 'success') return 'confirm';
    return forms?.activeForm;
  }, [forms?.activeForm, authFormType]);

  useEffect(() => {
    return () => {
      dispatch(setActivateAccount(undefined));
      dispatch({
        type: 'SIGNUP_TYPE_ACTIVATION',
        payload: undefined,
      });

      dispatch({
        type: 'SET_ACTIVE_ACCOUNT',
        payload: undefined,
      });
    };
  }, [dispatch]);

  const isBanner = useMemo(() => {
    return (
      settings?.bannerInLoginOrRegister &&
      visibleBanner &&
      !size.mobile &&
      authFormType !== 'forgot_password' &&
      authFormType !== 'success' &&
      !forms?.activation &&
      !signInRequired
      // && activationAccount !== 'registration_step_success'
    );
  }, [
    settings?.bannerInLoginOrRegister,
    visibleBanner,
    size,
    authFormType,
    forms?.activation,
    signInRequired,
    //  activationAccount
  ]);

  return (
    <div
      className={classNames('auth-section', {
        'auth-section_banner': isBanner,
        'auth-section_not_banner': !isBanner,
        'auth-section_require-form': signInRequired,
      })}
    >
      {signInRequired && <img className="auth-form_logo" src={authFormLogo} alt="auth logo" />}
      <div className="auth-section_title">{translateField(title, 'auth', words, false)}</div>
      <div className="auth-section_container">
        <Fragment>
          {isBanner && (
            <div className="auth-section_banner_container">
              <img
                className="auth-section_banner_image"
                src={`/uploads/${lang}_welcome-offer-bg.webp`}
                alt="banner"
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  setVisibleBanner(false);
                }}
              />
            </div>
          )}
          {renderForm(authFormType)}
        </Fragment>
      </div>
      {!forms?.activation && authFormType !== 'success' && !signInRequired && (
        <div className="handle-back-in-form">
          <ButtonTypes styled="rounded" location={'back-history'} onClick={() => navigate(-1)}>
            <ReactInlineSvg className="image arrow-left" src={arrowLeft} desciption="arrow" cacheRequests />
            <span>{translateField('back', 'basic', words)}</span>
          </ButtonTypes>
        </div>
      )}
    </div>
  );
};
