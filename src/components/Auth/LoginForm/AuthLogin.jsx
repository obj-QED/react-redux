import React, { Fragment, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';

import { ButtonsEl, Tab, ErrorsMain } from '../../../elements';
import { AnimatedPreloader } from '../../../components';

import { translateField } from '../../../shared/utils';

import { setActiveForm, setAuthTabCurrent } from '../../../store/actions';

import Login from '../_path/_Login';
import SocialAuth from '../SocialAuth/SocialAuth';

const RegBlock = ({ extraBlock = 'default', words, onClick }) => {
  if (extraBlock === 'minimal')
    return (
      <div className="auth-form_events auth-form_reg-block">
        <div className="auth-form_reg-block_text">{translateField('not_have_account', 'auth', words)}</div>
        <div className="auth-form_reg-block_link">
          <span onClick={onClick}>{translateField('registration', 'auth', words, false)}</span>
        </div>
      </div>
    );

  return (
    <ButtonsEl onClick={onClick} className="auth-form_events signin-button">
      {translateField('registration', 'auth', words, false)}
    </ButtonsEl>
  );
};

const AuthLogin = memo(() => {
  const dispatch = useDispatch();

  const words = useSelector((state) => state.words);
  const auth = useSelector((state) => state.authorization);
  const regBlock = useSelector((state) => state.settings?.loginForm_regBlock);

  const signInRequired = auth.form?.signInRequired;
  const signIn = auth.form?.signIn;
  const signInType = signIn?.type;
  // const signInType = useMemo(() => {
  //   return 'emaiOrPhone';
  // }, []);

  const signInSocial = signIn?.social;
  // const signInSocial = useMemo(() => {
  //   return [];
  // }, []);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loginEvent, setLoginEvent] = useState(null);
  const [tabKey, setTabKey] = useState(Date.now()); // Initial unique key

  const forgotPassword = useCallback(() => {
    dispatch(setActiveForm('forgot_password'));
  }, [dispatch]);

  const renderRegistration = useCallback(() => {
    dispatch(setActiveForm('registration'));
  }, [dispatch]);

  const handleLoginSuccess = useCallback(() => {
    setLoginEvent(true);
  }, []);

  const handleTabChange = useCallback(
    (key) => {
      setTabKey(Date.now());
      if (isFormOpen) setIsFormOpen(false);

      setActiveTabKey(key);
      dispatch(setAuthTabCurrent(`login_tab_${key}`));
    },
    [dispatch, isFormOpen],
  );
  const tabs = useMemo(() => {
    let tabsArray = [];
    const hasEmail = signIn?.values?.some((item) => item.id === 'email');
    const hasPhone = signIn?.values?.some((item) => item.id === 'phone');
    const hasWhatsApp = signInSocial?.includes('whatsApp') && signInSocial?.length === 1;
    const hasOtherSocials = signInSocial && signInSocial?.length !== 0;

    const socialTabName = () => {
      if (hasWhatsApp) return 'whatsapp';
      else if (hasOtherSocials) return 'social_tab';
    };

    if (signInType === 'selected' && !signInRequired) {
      tabsArray.push({
        key: 'login',
        name: translateField('login', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
            <Login eventSuccess={handleLoginSuccess} values={signIn?.values} step={signInType} formId="login_selected" />
            {!signInRequired && (
              <Fragment>
                {auth?.form?.registration && (
                  <ButtonsEl onClick={forgotPassword} className="auth-form_events restore-button">
                    {translateField('forgot_password', 'auth', words, false)}
                  </ButtonsEl>
                )}
                <SocialAuth cmd="signIn" type="signIn" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />
              </Fragment>
            )}
            {auth?.form?.registration && !signInRequired && <RegBlock extraBlock={regBlock} words={words} onClick={renderRegistration} />}
          </div>
        ),
      });
    } else if (signInType === 'emaiOrPhone' && !signInRequired) {
      if (hasEmail) {
        const filteredValues = Object.values(signIn?.values).filter((item) => item.id !== 'phone');

        tabsArray.push({
          key: 'email',
          name: translateField('email', 'tabs.list', words),
          comp: (
            <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
              <Login eventSuccess={handleLoginSuccess} values={filteredValues} step={`login_${signInType}_email`} formId="login_emaiOrPhone_email" />
              {!signInRequired && (
                <Fragment>
                  {auth?.form?.registration && (
                    <ButtonsEl onClick={forgotPassword} className="auth-form_events restore-button">
                      {translateField('forgot_password', 'auth', words, false)}
                    </ButtonsEl>
                  )}

                  <SocialAuth cmd="signIn" type="signIn" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />
                </Fragment>
              )}

              {auth?.form?.registration && !signInRequired && <RegBlock extraBlock={regBlock} words={words} onClick={renderRegistration} />}
            </div>
          ),
        });
      }
      if (hasPhone) {
        const filteredValues = Object.values(signIn?.values).filter((item) => item.id !== 'email');

        tabsArray.push({
          key: 'phone',
          name: translateField('phone', 'tabs.list', words),
          comp: (
            <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
              <Login eventSuccess={handleLoginSuccess} values={filteredValues} step={`login_${signInType}_phone`} formId="login_emaiOrPhone_phone" />
              {!signInRequired && (
                <Fragment>
                  {auth?.form?.registration && (
                    <ButtonsEl onClick={forgotPassword} className="auth-form_events restore-button">
                      {translateField('forgot_password', 'auth', words, false)}
                    </ButtonsEl>
                  )}
                  <SocialAuth cmd="signIn" type="signIn" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />
                </Fragment>
              )}
              {auth?.form?.registration && !signInRequired && <RegBlock extraBlock={regBlock} words={words} onClick={renderRegistration} />}
            </div>
          ),
        });
      }
    } else if (signInType === 'otpPhone' && !signInRequired) {
      tabsArray.push({
        key: 'login',
        name: translateField('login', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
            <Login eventSuccess={handleLoginSuccess} values={signIn?.values} step={signInType} formId="login_otpPhone" />
            {!signInRequired && (
              <Fragment>
                {auth?.form?.registration && (
                  <ButtonsEl onClick={forgotPassword} className="auth-form_events restore-button">
                    {translateField('forgot_password', 'auth', words, false)}
                  </ButtonsEl>
                )}
                <SocialAuth cmd="signIn" type="signIn" handleTabChange={() => handleTabChange(socialTabName(), setIsFormOpen(true))} />
              </Fragment>
            )}
            {auth?.form?.registration && !signInRequired && (
              <ButtonsEl onClick={renderRegistration} className="auth-form_events signin-button">
                {translateField('registration', 'auth', words, false)}
              </ButtonsEl>
            )}
          </div>
        ),
      });
    } else if (signInRequired) {
      const hasEmail = signIn?.values?.some((item) => item.id === 'email');

      const filteredValues = hasEmail ? signIn?.values?.filter((item) => item.id !== 'phone') : signIn?.values;

      tabsArray.push({
        key: 'login',
        name: translateField('login', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key="login_tab_signInRequired">
            <Login eventSuccess={handleLoginSuccess} values={filteredValues} step={signInType} formId="login_signInRequired" />
          </div>
        ),
      });
    }
    if (hasWhatsApp && !signInRequired) {
      tabsArray.push({
        key: 'whatsapp',
        name: translateField('whatsapp', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
            <SocialAuth cmd="signIn" type="signIn" openDefaultForm={true} formId="login_SocialAuth_whatsapp" />
          </div>
        ),
      });
    } else if (hasOtherSocials && !signInRequired) {
      tabsArray.push({
        key: 'social_tab',
        name: translateField('social_tab', 'tabs.list', words),
        comp: (
          <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
            <SocialAuth cmd="signIn" type="signIn" openDefaultForm={isFormOpen} formId="login_SocialAuth_other_social" />
          </div>
        ),
      });
    }

    if (tabsArray.length === 0) {
      tabsArray.push({
        key: 'not_tab',
        comp: (
          <div className="auth-form_wrapper" key={`login_tab_${tabKey}`}>
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
  }, [
    forgotPassword,
    handleLoginSuccess,
    handleTabChange,
    renderRegistration,
    signInSocial,
    signIn?.values,
    signInType,
    words,
    isFormOpen,
    regBlock,
    auth?.form?.registration,
    signInRequired,
    tabKey,
  ]);

  const getInitialTabKey = useCallback(() => {
    return tabs?.length > 0 ? tabs[0].key : null;
  }, [tabs]);

  const [activeTabKey, setActiveTabKey] = useState(getInitialTabKey);
  const activeTabIndex = tabs.findIndex((tab) => tab.key === activeTabKey);

  useEffect(() => {
    if (activeTabKey) {
      dispatch(setAuthTabCurrent(`login_tab_${activeTabKey}`));
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
    <div className="auth-form" key={`auth-form_${tabKey}`}>
      <div className="auth-form_login auth-form_container">
        {loginEvent || auth?.form?.activation || !signIn?.values ? (
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
  );
});

export default AuthLogin;
