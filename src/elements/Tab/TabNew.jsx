// Импорт необходимых библиотек и хуков
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';

import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useLocation } from 'react-router-dom';
import { removeImageOnError } from '../../shared/imageFailed';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const arrowIcon = `${UI_IMAGES_PATH}arrow.${UI_IMAGES_FORMAT}`;

export const TabNew = React.memo(({ tabs, activeTab, activeTabChange, onTabChange, className = '', navIsSlider = false, styled }) => {
  const size = useSelector((state) => state.handling.size);
  const location = useLocation();
  const [swiperInstance, setSwiperInstance] = useState(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (activeTabChange) {
      onTabChange(Number(activeTabChange));
      location.state = { TabsProfileGeneral: undefined };
    }
  }, [activeTab, activeTabChange, location, onTabChange]);

  const swiperSettings = useMemo(() => {
    return {
      slidesPerView: navIsSlider.slidesPerView,
      initialSlide: activeTab,
      autoHeight: false,
      height: 'auto',
      spaceBetween: navIsSlider.spaceBetween !== undefined ? navIsSlider.spaceBetween : size.mobile ? 10 : 20,
      speed: 1000,
      modules: [Navigation],
      centeredSlides: navIsSlider.centeredSlides,
      direction: navIsSlider.direction,
      navigation: {
        disabledClass: 'disable',
        nextEl: navIsSlider.nextEl ? `.${navIsSlider.nextEl}` : '',
        prevEl: navIsSlider.prevEl ? `.${navIsSlider.prevEl}` : '',
      },
    };
  }, [activeTab, size, navIsSlider]);

  useEffect(() => {
    if (swiperInstance && swiperRef.current) {
      swiperInstance.slideTo(activeTab);
    }
  }, [activeTab, swiperInstance]);

  const navigationSlider = useMemo(() => {
    return (
      <div
        className={classNames('tab__nav', {
          'border-bottom': navIsSlider.borderBottom,
          'nav-is-slider': navIsSlider.arrowRow,
          [navIsSlider.navigationClass]: navIsSlider.navigationClass,
        })}
      >
        {navIsSlider.arrow && (
          <div className="swiper-nav">
            <img
              className={classNames('swiper-arrow swiper-arrow-prev', { [navIsSlider.prevEl]: navIsSlider.prevEl })}
              src={arrowIcon}
              style={{ width: '20px', height: '20px' }}
              alt="prev"
            />
          </div>
        )}

        <Swiper
          {...swiperSettings}
          className={classNames('tab__swiper', { general: styled === 'general', [styled]: styled })}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            swiperRef.current = swiper;
          }}
        >
          {tabs
            ?.filter((tab) => tab !== false)
            ?.map((tab, index) => (
              <SwiperSlide key={tab.id} className={classNames('name', { active: index === activeTab })} onClick={() => onTabChange(index)}>
                {tab.name}
              </SwiperSlide>
            ))}
        </Swiper>

        {navIsSlider.arrow && (
          <div className="swiper-nav">
            <img
              className={classNames('swiper-arrow swiper-arrow-next', { [navIsSlider.nextEl]: navIsSlider.nextEl })}
              src={arrowIcon}
              style={{ width: '20px', height: '20px', transform: 'rotate(180deg)' }}
              alt="next"
            />
          </div>
        )}
      </div>
    );
  }, [activeTab, onTabChange, styled, swiperSettings, tabs, navIsSlider]);

  const navigationDefault = useMemo(() => {
    return (
      <div className={classNames('tab__nav', 'tab__nav-new', 'border-bottom', { [styled]: styled })}>
        {tabs?.map((tab, index) => {
          if (tab === false) return null;
          if (tab.hidden) return null;

          const imgSrc = `${UI_IMAGES_PATH}profile/${tab.key}.${UI_IMAGES_FORMAT}`;
          return (
            <div key={tab.id} className={classNames('tab-item item-rounded', { 'item--active': index === activeTab })} onClick={() => onTabChange(index)}>
              <div className="tab-item__icon">
                {UI_IMAGES_FORMAT === 'svg' ? (
                  <ReactInlineSvg cacheRequests className="item__icon_svg" src={imgSrc} onError={removeImageOnError} />
                ) : (
                  <img src={imgSrc} alt="logotype" onError={removeImageOnError} />
                )}
              </div>
              <div className={classNames('name', 'tab-item__title', { active: index === activeTab })}>{tab.name}</div>
            </div>
          );
        })}
      </div>
    );
  }, [activeTab, onTabChange, styled, tabs]);

  return (
    <div className={`tab ${className}`} key={activeTabChange}>
      {navIsSlider ? navigationSlider : navigationDefault}
      <div className="tab__content">{tabs[activeTab]?.comp}</div>
    </div>
  );
});
