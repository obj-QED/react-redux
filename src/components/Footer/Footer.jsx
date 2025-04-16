import React, { useState, useEffect, useRef, useMemo, Fragment, memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

import { Alerts, AnimatedPreloader } from '../../components';
import { ButtonLanguages, SocialIcons } from '../../elements';

import { translateField } from '../../shared/utils';
import { setHandleScroll } from '../../store/actions';
import { LOGOTYPE_IMAGES_PATH } from '../../shared/imagePathes';

import { LogoTypes, LogoTypesMinimal } from './FooterStyles';

const RenderProvidersLogo = ({ items }) => {
  const dispatch = useDispatch();

  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    if (!items?.length) return;

    const checkImage = (item) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = item.img;
        img.onload = img.onerror = () => resolve();
      });
    };

    Promise.all(items.map(checkImage)).then(() => {
      setTimeout(() => setShowPreloader(false), 1000);
    });
  }, [items]);

  const preloader = useMemo(
    () => (
      <div
        className="footer-preloader"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: showPreloader ? 1 : 0,
          visibility: showPreloader ? 'visible' : 'hidden',
          position: 'absolute',
          indet: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <AnimatedPreloader />
      </div>
    ),
    [showPreloader],
  );

  if (!items?.length) return null;

  return (
    <LogoTypesMinimal
      className="footer__logotypes footer__logotypes_providers"
      style={{
        position: 'relative',
      }}
    >
      {showPreloader && preloader}
      {items?.map((item, i) => (
        <Link
          to={item.url}
          onClick={() => dispatch(setHandleScroll('.grid-title'))}
          style={{
            opacity: showPreloader ? 0 : 1,
            visibility: showPreloader ? 'hidden' : 'visible',
          }}
          key={i}
        >
          <img
            src={item.img}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              const parent = e.target.parentElement;
              if (parent) parent.style.display = 'none';
            }}
          />
        </Link>
      ))}
    </LogoTypesMinimal>
  );
};

export const Footer = memo(() => {
  const dispatch = useDispatch();
  const api = useSelector((state) => state.api);
  const words = useSelector((state) => state.words);
  const alertsRef = useRef(null);
  const [footerPaddingBottom, setFooterPaddingBottom] = useState(0);
  const location = useLocation();
  const size = useSelector((state) => state.handling.size);
  const settings = useSelector((state) => state.settings);
  const logoTypeList = settings.logotypeList;
  const logoTypeList2 = settings.logotypeList2;
  const footerProvidersLogo = settings.footerProvidersLogo;

  const providers = useSelector((state) => state.api.gamesList?.providers2);
  const logoTypeList3 = footerProvidersLogo && providers;

  const meta = useSelector((state) => state.meta);

  useEffect(() => {
    const updateFooterPadding = () => {
      if (alertsRef.current) {
        const heightBtns = alertsRef.current.querySelector('.alerts_buttons .alerts_support-chats')?.clientHeight || 0;
        const alertsHeight = alertsRef.current.clientHeight + heightBtns;
        setFooterPaddingBottom(alertsHeight);
      }
    };

    const currentAlertsRef = alertsRef.current;

    const observer = new ResizeObserver(() => {
      updateFooterPadding();
    });

    if (currentAlertsRef) {
      observer.observe(currentAlertsRef.querySelector('.alerts_buttons'));
    }

    window.addEventListener('resize', updateFooterPadding);

    return () => {
      if (currentAlertsRef) {
        observer.unobserve(currentAlertsRef.querySelector('.alerts_buttons'));
      }
      window.removeEventListener('resize', updateFooterPadding);
    };
  }, [size, alertsRef]);

  const menu_local_state = localStorage.getItem('menu_local');
  const menu_api = useSelector((state) => state.api.page?.menu)?.find((item) => item.name === 'footer')?.items;
  const menu_local = JSON.parse(menu_local_state)?.find((item) => item.name === 'footer')?.items;
  const menuData = menu_local ? menu_local : menu_api;
  const mapSite = menuData;
  const [loadLogo, setLoadLogo] = useState(false);

  const renderItem = useCallback(
    (item, parentIndex, subIndex, isGames) => {
      const { url, key } = item;
      return (
        <li className="footer__item item" key={`item_${parentIndex}_${subIndex}`}>
          <Link
            to={url}
            className={classNames('footer__link', { active: location.pathname === url })}
            onClick={isGames ? () => dispatch(setHandleScroll('.grid-title')) : undefined}
          >
            {translateField(key, 'pages', words, false)}
          </Link>
        </li>
      );
    },
    [dispatch, location.pathname, words],
  );

  const renderMapSite = useMemo(() => {
    return mapSite?.map((item, i) => {
      const isGames = item.key === 'games';
      return (
        <div key={item + i} className={classNames('footer__column', {})}>
          <h3 className="footer__column__title">{translateField(item?.key, 'pages', words)}</h3>
          <ul className="footer__column__list map-site__list">{item.items?.map((subItem, j) => renderItem(subItem, i, j, isGames))}</ul>
        </div>
      );
    });
  }, [mapSite, words, renderItem]);

  const scrollToTop = () => {
    const viewContainer = document.querySelector('.flex-view .view');
    if (viewContainer) viewContainer?.scrollTo({ top: 0 });
    else window.scroll(0, 0);
  };

  const renderLogo = useMemo(() => {
    const isRenderLogo = api.page.logo;
    if (loadLogo || isRenderLogo === '') return null;

    return (
      api.loading && (
        <Link to="/" className="logo" onClick={scrollToTop}>
          {isRenderLogo &&
            (isRenderLogo.startsWith('/') ? (
              <img
                className="logo__image"
                src={isRenderLogo}
                alt="logo"
                onLoad={(e) => {
                  e.target.style.display = 'block';
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  setLoadLogo(true);
                }}
              />
            ) : (
              <div className="logo__text">
                <span>{isRenderLogo}</span>
              </div>
            ))}
        </Link>
      )
    );
  }, [api.loading, api.page.logo, loadLogo]);

  const additionalBlock = (
    <div className="footer__info-site">
      <ButtonLanguages title={false} />
      {meta.content && location.pathname === '/' && <div className="meta-data" dangerouslySetInnerHTML={{ __html: meta.content ?? '' }} />}
      <div className="information">
        {renderLogo}
        <div className="copyright">
          <p>{translateField('copyright', 'basic', words, false)}</p>
        </div>
      </div>
    </div>
  );

  const renderLogotype = (items) => {
    if (!items?.length) return null;
    return items?.map((item, i) => {
      const imageElement = <img key={i} src={`${LOGOTYPE_IMAGES_PATH}${item.image}`} alt="logo" />;
      return item.url ? (
        <a href={item.url} target="_blank" rel="noreferrer" key={i}>
          {imageElement}
        </a>
      ) : (
        imageElement
      );
    });
  };

  const getMaxItemsPerColumn = (mapSite) => {
    let maxItems = 0;
    mapSite?.forEach((item) => {
      if (item.items?.length > maxItems) {
        maxItems = item.items?.length;
      }
    });
    return maxItems;
  };

  const renderTitle = (title = '', i) => (
    <h3 className="footer__column__title" key={`title_${i}`}>
      {translateField(title.replace(/ /g, '_').toLowerCase(), 'pages', words, false)}
    </h3>
  );

  const renderFooterColumnsMobile = (mapSite) => {
    const maxItemsPerColumn = getMaxItemsPerColumn(mapSite);
    const column1 = [];
    const columns = [column1];

    mapSite.forEach((item, i) => {
      const { key, items } = item;
      const currentColumn = items?.length < maxItemsPerColumn ? column1 : [];
      currentColumn.push(<li key={`title_wrap_${i}`}>{renderTitle(key, i)}</li>);
      items?.forEach((subItem, subIndex) => {
        currentColumn.push(renderItem(subItem, i, subIndex, key === 'games'));
      });
      if (currentColumn !== column1 && currentColumn.length > 0) {
        columns.push(currentColumn);
      }
    });

    return columns
      ?.filter((column) => column.length > 0)
      ?.map((column, i) => (
        <ul className="footer__column" key={`column--${i}`}>
          {column}
        </ul>
      ));
  };

  return (
    <Fragment>
      <footer className="footer" style={{ paddingBottom: size.mobile ? `${footerPaddingBottom}px` : '' }}>
        {mapSite && (
          <div className="container container-mini">
            <div
              className={classNames('footer__map-site map-site', {
                flexbox: mapSite?.length <= 3 && (!size.mobile || (size.mobile && size.orientation === 'horizontal')),
                'single-column': mapSite?.length === 1,
              })}
            >
              {!size.mobile || (size.mobile && size.orientation === 'horizontal') ? renderMapSite : renderFooterColumnsMobile(mapSite)}
            </div>
          </div>
        )}
        {logoTypeList3 && (
          <div className="container">
            <RenderProvidersLogo items={logoTypeList3} />
          </div>
        )}
        <div className="container container-mini">
          {logoTypeList && <LogoTypes className="footer__logotypes">{renderLogotype(logoTypeList)}</LogoTypes>}
          {logoTypeList2 && <LogoTypes className="footer__logotypes">{renderLogotype(logoTypeList2)}</LogoTypes>}
          {additionalBlock}
        </div>
        <SocialIcons />
      </footer>
      <Alerts forwardedRef={alertsRef} />
    </Fragment>
  );
});
