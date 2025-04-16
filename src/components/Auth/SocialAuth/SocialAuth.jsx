import React, { useMemo, memo, Fragment, useState, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { translateField } from '../../../shared/utils';
import { SOCIAL_AUTH } from '../SocialAuth';
import SocialCustom from '../_path/_SocialCustom'; // Adjust the import path accordingly

const SocialAuth = memo(({ cmd, type = 'signIn', handleTabChange, openDefaultForm = false, formId }) => {
  const whatsAppRef = useRef(null);

  const words = useSelector((state) => state.words);
  const auth = useSelector((state) => state.authorization);

  const activeOtherSocial = auth.form?.whatsapp?.activeStep;
  const statusOtherSocial = auth.form?.whatsapp?.status;
  const hiddenAuthSoocial = auth.form.hiddenAuthSoocial;

  const listSocial = auth?.form[type]?.social;
  // const listSocial = useMemo(() => {
  //   return [];
  // }, []);

  const socialData = auth.form.social;

  const [showWhatsAppCustom, setShowWhatsAppCustom] = useState(openDefaultForm);
  const [shouldHideRenderSocialAuth, setShouldHideRenderSocialAuth] = useState(false);

  useEffect(() => {
    if (activeOtherSocial && statusOtherSocial) {
      setShouldHideRenderSocialAuth(true);
    } else {
      setShouldHideRenderSocialAuth(false);
    }
  }, [activeOtherSocial, statusOtherSocial]);

  useEffect(() => {
    if (openDefaultForm && whatsAppRef.current) {
      whatsAppRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [openDefaultForm]);

  const filteredSocialList = useMemo(() => {
    if (activeOtherSocial) {
      return listSocial.filter((social) => social !== 'whatsApp');
    }
    return listSocial;
  }, [listSocial, activeOtherSocial]);

  const TITLE = useMemo(() => {
    if (type === 'signIn' && !activeOtherSocial) {
      return translateField('or_login', 'auth.button', words, false);
    } else if (type === 'registration') {
      return translateField('or_can_registration', 'auth.button', words, false);
    } else if (type === 'signIn' && activeOtherSocial) {
      return translateField('other_social_registration', 'auth.button', words, false);
    } else {
      return null;
    }
  }, [words, type, activeOtherSocial]);

  const handleWhatsAppClick = useCallback(() => {
    if (handleTabChange) handleTabChange();

    setShowWhatsAppCustom(true);
  }, [handleTabChange]);

  const renderSocialAuth = useMemo(() => {
    return (
      <div className="social-form" key={`${cmd}_${type}_${formId}`}>
        {filteredSocialList?.length > 0 && (
          <Fragment>
            {TITLE && (
              <div className="social-form_title" style={{ color: '#fff' }}>
                {TITLE}
              </div>
            )}
            <div className="social-form_buttons">
              {filteredSocialList.map((item) => {
                const SocialAuthComponent = SOCIAL_AUTH[item];
                const authId = socialData?.[item];
                return SocialAuthComponent ? (
                  <SocialAuthComponent key={item} isSignIn={type === 'signIn' ? true : false} authId={authId} clickHandler={handleWhatsAppClick} />
                ) : null;
              })}
            </div>
          </Fragment>
        )}
      </div>
    );
  }, [socialData, TITLE, filteredSocialList, handleWhatsAppClick, cmd, type, formId]);

  if (listSocial?.length === 0 || hiddenAuthSoocial) return;

  return (
    <Fragment key={`${cmd}_${type}_${formId}_${openDefaultForm}`}>
      {(showWhatsAppCustom || openDefaultForm) && <SocialCustom variable="whatsapp" cmd={cmd} ref={whatsAppRef} />}
      {!shouldHideRenderSocialAuth && renderSocialAuth}
    </Fragment>
  );
});

export default SocialAuth;
