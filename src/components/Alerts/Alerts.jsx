import React, { Fragment, useRef, memo, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { IntercomProvider } from 'react-use-intercom';

import { MobileMenu } from '../../components';
import { ScrollToTopButton, SupportButtons, A2hs, Intercom, Cookies } from '../../elements/';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../shared/imagePathes';

export const Alerts = memo(({ forwardedRef }) => {
  const location = useLocation();
  const refBotmakerContainer = useRef(null);

  const settings = useSelector((state) => state.settings);
  const handling = useSelector((state) => state.handling);

  const size = handling.size;
  const menuWidth = handling.menuWidth;

  const support = useSelector((state) => state.api?.supportNetworks);
  const intercom = support?.intercom;
  const botmaker = support?.botmaker;

  const [botmakerMaximized, setBotmakerMaximized] = useState(localStorage.getItem('@botmaker-chat:maximized') === 'true');

  useEffect(() => {
    if (botmaker) {
      const updateBotmakerMaximized = () => {
        setBotmakerMaximized(localStorage.getItem('@botmaker-chat:maximized') === 'true');
      };

      window.addEventListener('storage', updateBotmakerMaximized);

      return () => {
        window.removeEventListener('storage', updateBotmakerMaximized);
      };
    }
  }, [botmaker]);

  const intercomRender = useMemo(() => {
    if (!intercom) return;

    return (
      <IntercomProvider appId={intercom} autoBoot>
        <div
          className={classNames('intercom-lobby', {
            'menu-opened': settings?.humburgerMenu?.staticPosition && handling?.openMenu && !size.mobile,
          })}
        >
          <Intercom lobby={true} />
        </div>
      </IntercomProvider>
    );
  }, [intercom, settings, handling, size]);

  const botmakerRender = useMemo(() => {
    if (!botmaker) return;

    let logo = `${SOCIAL_IMAGES_PATH}botmaker.${SOCIAL_IMAGES_FORMAT}`;

    return (
      <div
        className={classNames('botmaker-chat', {
          'botmaker-chat--maximized': botmakerMaximized,
          'botmaker-chat--minimized': !botmakerMaximized,
        })}
        style={{
          display: location?.pathname?.includes('/game/') ? 'none' : 'block',
        }}
      >
        <img
          src={logo}
          alt="alt"
          className="botmaker-chat_img"
          width="55"
          height="55"
          onError={(e) => {
            e.target.onerror = null;
            e.target.remove();
          }}
        />

        <div id="botmaker-webchat-container" ref={refBotmakerContainer} />
      </div>
    );
  }, [botmaker, location, botmakerMaximized]);

  return (
    <Fragment>
      <div
        className="alerts"
        style={{
          maxWidth: size.mobile ? '100%' : `calc(100% - ${menuWidth}px)`,
        }}
        ref={forwardedRef}
      >
        <div className="alerts_content">
          <div className="alerts_buttons">
            <div className="alerts_support-chats">
              {botmakerRender}
              {intercomRender}
              {settings.supportButtons?.lobby && <SupportButtons direction="top" type="support--lobby" />}
            </div>
            <ScrollToTopButton />
          </div>

          <Cookies />
          {size.mobile && <A2hs />}

          {size.mobile && (
            <div className="alerts_menu-mobile">
              <MobileMenu />
            </div>
          )}
        </div>
      </div>

      {/* {settings.supportButtons?.lobby && (
        <SupportButtons
          direction="top"
          type="support--lobby"
          style={{
            bottom: heightAlerts + heightPwa,
          }}
        />
      )} */}
      {/* <ScrollToTopButton
        style={{
          bottom: calculateScrollToTopButtonBottom(),
        }}
      /> */}
      {/* <Cookies bottom={bottomPwa + heightPwa + 5} onClose={handleCookiesClose} /> */}
      {/* <A2hs bottom={bottomPwa} onClose={handleA2hsClose} /> */}
      {/* {botmaker && (
        <div
          id="botmaker-webchat-container"
          style={{
            display: location?.pathname?.includes('/game/') ? 'none' : 'block',
            bottom: heightAlerts + heightPwa - 2,
            right: withIntercom ? 75 + 50 : size.mobile ? 10 : 75,
            maxHeight: `calc(100% - (${heightAlerts}px + ${heightPwa}px))`,
          }}
          className={classNames('', {
            'botmaker-webchat--pwa': closeA2hsValue === 'true',
          })}
        />
      )} */}
      {/* {size.mobile && (
        <div className="alerts" ref={forwardedRef}>
          <Field>
            <MobileMenu />
          </Field>
        </div>
      )} */}
    </Fragment>
  );
});
