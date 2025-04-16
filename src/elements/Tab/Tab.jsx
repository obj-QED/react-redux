// Импорт необходимых библиотек и хуков
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { useLocation } from 'react-router-dom';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const arrowIcon = `${UI_IMAGES_PATH}arrow.${UI_IMAGES_FORMAT}`;

export const Tab = React.memo(({ tabs, activeTab, activeTabChange, onTabChange, className = '', navIsSlider, styled }) => {
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
              <SwiperSlide
                key={tab.id}
                className={classNames('name', { active: index === activeTab, [`name--${tab.name.toLowerCase()}`]: tab.name })}
                onClick={() => onTabChange(index)}
              >
                <span>{tab.name}</span>
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
      <div
        className={classNames('tab__nav', {
          general: styled === 'general',
          [styled]: styled,
          [navIsSlider.navigationClass]: navIsSlider.navigationClass,
        })}
      >
        {tabs
          ?.filter((tab) => tab !== false)
          ?.map((tab, index) => {
            if (tab.hidden) return null;
            return (
              <div key={tab.id} className={classNames('name', { active: index === activeTab, [`name--${tab.name.toLowerCase()}`]: tab.name })} onClick={() => onTabChange(index)}>
                <span>{tab.name}</span>
              </div>
            );
          })}
      </div>
    );
  }, [activeTab, onTabChange, styled, tabs, navIsSlider]);

  return (
    <div className={`tab ${className}`} key={activeTabChange}>
      {navIsSlider ? navigationSlider : navigationDefault}
      <div className="tab__content">{tabs[activeTab]?.comp}</div>
    </div>
  );
});
