import React, { useRef, useState, Fragment, useMemo, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { IntercomProvider } from 'react-use-intercom';
import TawkMessengerReact from '@tawk.to/tawk-messenger-react';

import { Intercom } from '../../elements';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { translateField } from '../../shared/utils';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../shared/imagePathes';
import { Livechat } from './Livechat/Livechat';

/**
 * Note: Компонент SupportButtons - представляет собой блок поддержки с кнопкой-триггером и списком иконок социальных сетей.
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.direction - Направление, в котором отображается блок (вертикально или горизонтально).
 * @param {string} props.type - Тип блока (по умолчанию 'inCategories').
 * @param {boolean} props.label - Флаг, указывающий, нужно ли отображать метку с текстом "Поддержка".
 * @param {boolean} props.positionStatic - Флаг, указывающий, должен ли блок оставаться открытым (без анимации) в статическом положении.
 * @param {Object} props.style - Дополнительные стили для блока.
 *
 */
export const SupportButtons = memo(({ direction, type = 'inCategories', label = false, positionStatic, style, title, className }) => {
  const ref = useRef();
  const apiSupportNetworks = useSelector((state) => state?.api?.supportNetworks);
  const supportNetworks = useMemo(() => {
    if (apiSupportNetworks) {
      return apiSupportNetworks;
    } else {
      return {};
    }
  }, [apiSupportNetworks]);

  const api = useSelector((state) => state?.api);

  const settings = useSelector((state) => state?.settings);
  const words = useSelector((state) => state.words);
  const [opened, setOpened] = useState(false);
  const filteredSupportNetworks = supportNetworks ? Object?.fromEntries(Object?.entries(supportNetworks)?.filter(([key, value]) => value)) : [];

  const supportList = filteredSupportNetworks;

  useOutsideClick(ref, () => setOpened(false), opened);

  const handling = useSelector((state) => state.handling);
  const size = useSelector((state) => state.handling.size);

  const intercom = useSelector((state) => state.api.supportNetworks?.intercom);

  const tawkChat = useSelector((state) => state?.api?.supportNetworks?.chat1);

  const tawkMessengerRef = useRef();

  const [propertyId, widgetId] = useMemo(() => {
    if (tawkChat) {
      const [propertyId, widgetId] = tawkChat?.split('/');
      return [propertyId, widgetId];
    }
    return [null, null];
  }, [tawkChat]);

  const [tawkChatClose, setTawkChatClose] = useState(true);

  useEffect(() => {
    if (propertyId && widgetId) {
      const handleClickOutside = (event) => {
        if (ref?.current)
          if (!ref.current?.contains(event.target)) {
            // Проверяем, был ли клик за пределами компонента
            // Вызываем метод isChatMinimized(), если чат Tawk.to открыт
            if (tawkMessengerRef?.current && !tawkMessengerRef?.current?.isChatMinimized()) {
              tawkMessengerRef?.current?.minimize();
            }
          }
      };

      // Добавляем обработчик клика при монтировании компонента
      document.addEventListener('click', handleClickOutside);

      // Удаляем обработчик клика при размонтировании компонента
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [ref, tawkMessengerRef, propertyId, widgetId]);

  const renderSupport = useMemo(() => {
    let keys = Object?.keys(supportNetworks);

    return keys?.map((item, i) => {
      const onLoad = () => {
        if (tawkMessengerRef.current?.hideWidget()) {
          tawkMessengerRef.current?.hideWidget();
        }
      };

      const onToggleTawk = () => {
        if (tawkMessengerRef) {
          tawkMessengerRef?.current?.toggle();
          if (tawkMessengerRef?.current?.isChatMaximized()) {
            setTawkChatClose(false);
          }
          if (tawkMessengerRef?.current?.isChatMinimized()) {
            setTawkChatClose(true);
          }
        }
      };

      const onVisitorNameChanged = (visitorName) => {
        const token = localStorage.getItem('token');
        const login = api.login;

        if (token && visitorName !== token) {
          tawkMessengerRef?.current.setVisitorName(login);
        } else {
          tawkMessengerRef?.current.setVisitorName(visitorName);
        }
      };

      if (supportNetworks[item]) {
        let logo = `${SOCIAL_IMAGES_PATH}${type}_${item}.${SOCIAL_IMAGES_FORMAT}`;
        let link = typeof supportNetworks[item] === 'string' ? supportNetworks[item] : '';

        switch (item) {
          case 'whatsapp':
            return (
              <a key={`${item}-${i}`} className="support-method" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${link}`}>
                <img
                  src={logo}
                  alt={item}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode?.remove();
                  }}
                />
              </a>
            );
          case 'jivosite':
            return (
              <div key={`${item}-${i}`} className="support-method" onClick={() => window?.jivo_api?.open()}>
                <img
                  src={logo}
                  alt={item}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode.remove();
                  }}
                />
              </div>
            );
          case 'intercom':
            return (
              <div className="support-method" key={`${item}-${i}`}>
                <IntercomProvider appId={intercom} autoBoot>
                  <Intercom />
                </IntercomProvider>
              </div>
            );
          case 'email':
            return (
              <a key={`${item}-${i}`} className="support-method" href={`mailto:${supportNetworks[item]}`}>
                <img
                  src={logo}
                  alt={item}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentNode?.remove();
                  }}
                />
              </a>
            );
          case 'chat1':
            return (
              <Fragment key={`${item}-${i}`}>
                <div className="support-method" onClick={onToggleTawk}>
                  <img
                    className={classNames('image', {
                      'close-chat': !tawkChatClose,
                    })}
                    src={`${SOCIAL_IMAGES_PATH}chat-tawk.${SOCIAL_IMAGES_FORMAT}`}
                    alt="tawk"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentNode.remove();
                    }}
                  />
                </div>
                <TawkMessengerReact propertyId={propertyId} widgetId={widgetId} onLoad={onLoad} onVisitorNameChanged={onVisitorNameChanged} ref={tawkMessengerRef} />
              </Fragment>
            );
          case 'chat2':
            return (
              <Fragment key={`${item}-${i}`}>
                <Livechat />
              </Fragment>
            );

          case 'botmaker':
            return null;
          default:
            return (
              <a key={`${item}-${i}`} className="support-method" target="_blank" rel="noopener noreferrer" href={link}>
                <img
                  src={logo}
                  alt={item}
                  onError={(e) => {
                    e.target.onerror = null;
                    const parent = e.target?.parentNode;
                    if (parent) {
                      parent.remove();
                    }
                  }}
                />
              </a>
            );
        }
      } else {
        return null; // Явный возврат null в случае, когда условие не выполняется
      }
    });
  }, [supportNetworks, intercom, tawkChatClose, api.login, propertyId, widgetId, type]);

  if (!renderSupport || renderSupport?.length === 0) return null;

  return (
    <Fragment>
      {title && <div className="support_title">{translateField('support_title', words)}</div>}
      <div
        ref={ref}
        className={classNames(`support ${type}`, {
          'direction-center': Object?.keys(supportList).length <= 4 && settings?.supportButtons?.menuTrigger,
          'menu-opened': settings?.humburgerMenu?.staticPosition && handling?.openMenu && !size.mobile,
          [className]: className,
        })}
        data-opened={positionStatic || opened}
        data-direction={direction}
        style={style}
      >
        <div className="trigger item" onClick={() => setOpened(!opened)}>
          <div
            className="icon"
            style={{
              backgroundImage: `url(${SOCIAL_IMAGES_PATH}${type}/support.${SOCIAL_IMAGES_FORMAT})`,
            }}
          />
          {label && <span className="label">{words.server.support}</span>}
        </div>
        <div
          className={classNames('list center', {
            // center: Object.keys(supportList).length <= 2,
          })}
        >
          {renderSupport}
        </div>
      </div>
    </Fragment>
  );
});
