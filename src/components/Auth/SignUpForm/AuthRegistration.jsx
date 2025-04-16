import React, { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';

import { AnimatedPreloader } from '../../../components';
import { Tab, ErrorsMain } from '../../../elements';

import { translateField } from '../../../shared/utils';
import { setAuthTabCurrent, setActiveForm } from '../../../store/actions';

import Registration from '../_path/_Registration';
import RegistrationSteps from '../_path/_RegistrationSteps';

import SocialAuth from '../SocialAuth/SocialAuth';

const LoginBlock = ({ extraBlock = 'default', words, onClick }) => {
  if (extraBlock === 'minimal')
    return (
      <div className="auth-form_events auth-form_reg-block">
        <div className="auth-form_reg-block_text">{translateField('you_have_account', 'auth', words)}</div>
        <div className="auth-form_reg-block_link">
          <span onClick={onClick}>{translateField('login_button', 'auth', words, false)}</span>
        </div>
      </div>
    );

  return null;
};

const AuthLogin = memo(() => {
  const dispatch = useDispatch();

  const words = useSelector((state) => state.words);
  const auth = useSelector((state) => state.authorization);
  const loginBlock = useSelector((state) => state.settings?.regForm_loginBlock);

  const signInRequired = auth.form?.signInRequired;
  const activation = auth?.form?.activation;
  const registration = auth.form?.registration;
  const registrationInType = registration?.type;
  // const registrationInType = useMemo(() => {
  //   return 'otpPhone';
  // }, []);

  const registrationSocial = registration?.social;
  // const registrationSocial = useMemo(() => {
  //   return [];
  // }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [regEvent, setRegEvent] = useState(null);

  // const [hiddenChangeTab, setHiddenChangeTab] = useState(null);

  const handleTabChange = useCallback(
    (key) => {
      if (isFormOpen) setIsFormOpen(false);

      setActiveTabKey(key);
      dispatch(setAuthTabCurrent(`reg_tab_${key}`));
    },
    [dispatch, isFormOpen],
  );

  const renderLogin = useCallback(() => {
    dispatch(setActiveForm('login'));
  }, [dispatch]);

  const handleRegSuccess = useCallback(() => {
    setRegEvent(true);
  }, []);

  const tabs = useMemo(() => {
    let tabsArray = [];
    const hasEmail = registration?.values?.some((item) => item.id === 'email');
    const hasPhone = registration?.values?.some((item) => item.id === 'phone');
    const hasWhatsApp = registrationSocial?.includes('whatsApp') && registrationSocial?.length === 1;
    const hasOtherSocials = registrationSocial?.length !== 0;
    const socialTabName = () => {
      if (hasWhatsApp) return 'whatsapp';
      else if (hasOtherSocials) return 'social_tab';
    };

    if (registrationInType === 'selected') {
      tabsArray.push({
        key: 'registration',
        name: translateField('registration', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper">
            <Registration eventSuccess={handleRegSuccess} formId="reg_selected" step="start" values={registration.values} />
            {!signInRequired && <SocialAuth cmd="signUp" type="registration" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />}
            <LoginBlock extraBlock={loginBlock} words={words} onClick={renderLogin} />
          </div>
        ),
      });
    } else if (registrationInType === 'emaiOrPhone') {
      if (hasEmail) {
        const filteredValues = Object.values(registration.values).filter((item) => item.id !== 'phone');

        tabsArray.push({
          key: 'email',
          name: translateField('email', 'tabs.list', words),
          comp: (
            <div className="auth-form_wrapper">
              <Registration eventSuccess={handleRegSuccess} formId="reg_emaiOrPhone_email" step="start" values={filteredValues} />
              {!signInRequired && <SocialAuth cmd="signUp" type="registration" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />}
              <LoginBlock extraBlock={loginBlock} words={words} onClick={renderLogin} />
            </div>
          ),
        });
      }
      if (hasPhone) {
        const filteredValues = Object.values(registration.values).filter((item) => item.id !== 'email');

        tabsArray.push({
          key: 'phone',
          name: translateField('phone', 'tabs.list', words),
          comp: (
            <div className="auth-form_wrapper">
              <Registration eventSuccess={handleRegSuccess} formId="reg_emaiOrPhone_phone" step="start" values={filteredValues} />
              {!signInRequired && <SocialAuth cmd="signUp" type="registration" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />}
              <LoginBlock extraBlock={loginBlock} words={words} onClick={renderLogin} />
            </div>
          ),
        });
      }

      if (!hasEmail && !hasPhone) {
        tabsArray.push({
          key: 'registration',
          name: translateField('registration', 'tabs.list', words),
          comp: (
            <div className="auth-form_wrapper">
              <Registration eventSuccess={handleRegSuccess} formId="reg_emaiOrPhone_not_email_and_phone" step="start" values={registration.values} />
              {!signInRequired && <SocialAuth cmd="signUp" type="registration" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />}
              <LoginBlock extraBlock={loginBlock} words={words} onClick={renderLogin} />
            </div>
          ),
        });
      }
    } else if (registrationInType === 'otpPhone') {
      tabsArray.push({
        key: 'phone',
        name: translateField('phone', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper">
            <RegistrationSteps />
            {!signInRequired && <SocialAuth cmd="signUp" type="registration" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />}
            <LoginBlock extraBlock={loginBlock} words={words} onClick={renderLogin} />
          </div>
        ),
      });
    }

    if (hasWhatsApp && !signInRequired) {
      tabsArray.push({
        key: 'whatsapp',
        name: translateField('whatsapp', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key="reg_hasWhatsApp">
            <SocialAuth cmd="signUp" type="registration" openDefaultForm={true} formId="reg_SocialAuth_whatsapp" />
          </div>
        ),
      });
    } else if (hasOtherSocials && !signInRequired) {
      tabsArray.push({
        key: 'social_tab',
        name: translateField('social_tab', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key="reg_hasOtherSocials">
            <SocialAuth cmd="signUp" type="registration" openDefaultForm={isFormOpen} formId="reg_SocialAuth_other_social" />
          </div>
        ),
      });
    }

    if (tabsArray.length === 0) {
      tabsArray.push({
        key: 'not_tab',
        comp: (
          <div className="auth-form_wrapper" key="reg_not_tab">
            <ErrorsMain
              errorMessages={['Sorry this form is disabled, please contact the administrator.']}
              styled="block"
              position="center"
              translate={false}
              className="auth-form__message"
            />
          </div>
        ),
      });
    }

    return tabsArray.filter(Boolean).map((tab, index) => ({
      ...tab,
      id: index.toString(),
    }));
  }, [handleTabChange, registrationSocial, registration.values, registrationInType, words, isFormOpen, handleRegSuccess, signInRequired, loginBlock, renderLogin]);

  const getInitialTabKey = useCallback(() => {
    return tabs?.length > 0 ? tabs[0].key : null;
  }, [tabs]);

  const [activeTabKey, setActiveTabKey] = useState(getInitialTabKey);
  const activeTabIndex = tabs.findIndex((tab) => tab.key === activeTabKey);

  useEffect(() => {
    if (activeTabKey) {
      dispatch(setAuthTabCurrent(`reg_tab_${activeTabKey}`));
    }
    return () => dispatch(setAuthTabCurrent(undefined));
  }, [activeTabKey, dispatch]);

  const preloader = useMemo(
    () => (
      <div className="auth-form_wrapper" style={{ borderTopRightRadius: '16px' }}>
        <div className="form-preloader form-preloader_login">
          <AnimatedPreloader />
        </div>
      </div>
    ),
    [],
  );

  return (
    <Fragment>
      <div className="auth-form">
        <div className="auth-form_registration auth-form_container">
          {regEvent || activation || !registration?.values ? (
            preloader
          ) : (
            <Tab
              tabs={tabs}
              activeTab={activeTabIndex}
              onTabChange={(index) => handleTabChange(tabs[index].key)}
              navIsSlider={false}
              className={classNames('auth-form-tabs', {
                'hide-nav': tabs?.length === 1,
              })}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
});

export default AuthLogin;
