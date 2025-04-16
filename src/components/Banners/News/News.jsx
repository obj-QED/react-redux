import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

import { translateField } from '../../../shared/utils';

import { NewsItem } from './NewsItem/NewsItem';

export const News = () => {
  const words = useSelector((state) => state.words);

  const size = useSelector((state) => state.handling.size);
  const refContainer = useRef(null);
  // * определение количества слайдов
  const [countSlides, setCountSlides] = useState(0);
  const supportNetworks = useSelector((state) => state.api.supportNetworks);

  const newsItemList = [
    { id: 0, text: '$57,333.00', title: 'Max win', label: 'For week', labelBackground: '#96005A' },
    {
      id: 1,
      supportNetworks: supportNetworks ? supportNetworks : {},
      title: translateField('support_title', 'banner.news', words, false),
      label: translateField('support_label', 'banner.news', words, false),
      labelBackground: 'linear-gradient(90deg, #5889FF -14.24%, #4875FE 95.64%)',
    },
    {
      id: 2,
      title: translateField('raiting_title', 'banner.news', words, false),
      label: translateField('raiting_label', 'banner.news', words, false),
      labelBackground: 'linear-gradient(180deg, #FF7002 0%, #FF7804 100%)',
    },
    {
      id: 3,
      title: translateField('last_drop_title', 'banner.news', words, false),
      labelBackground: 'linear-gradient(90deg, #12D081 0%, #08C679 100%)',
    },
  ];
  const items = (itemList) => {
    return itemList.map((item, i) => {
      return (
        <SwiperSlide key={item + i}>
          <NewsItem {...item} />
        </SwiperSlide>
      );
    });
  };

  // Inside the component
  const getSlidesCount = useCallback(() => {
    const containerWidth = refContainer.current?.clientWidth || 0;
    const slideWidth = 269 + 14; // Width of each slide

    if (size.width < 768 && !size.landscape && newsItemList?.length >= 2) {
      return 2;
    }

    const slidesToFit = Math.floor(containerWidth / slideWidth);
    return Math.min(slidesToFit, newsItemList?.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size, newsItemList?.length, refContainer]);

  useEffect(() => {
    setCountSlides(getSlidesCount());
  }, [size, refContainer, getSlidesCount]);

  // * настройка слайдера
  const swiperSettings = {
    slidesPerView: countSlides, // Количество видимых слайдов
    speed: 500, // Скорость переключения слайдов
    loop: true,
    autoplay: true,
    breakpoints: {
      0: {
        slidesPerView: 'auto',
      },
      667: {
        slidesPerView: countSlides,
      },
    },
    modules: [Autoplay],
  };

  const maxWidth = countSlides >= 2 ? `${Math.min(countSlides, getSlidesCount()) * (269 + 14)}px` : null;

  return (
    <div className="news" ref={refContainer}>
      <Swiper className="news__swiper" {...swiperSettings} {...(maxWidth && { style: { maxWidth } })}>
        {items(newsItemList)}
      </Swiper>
    </div>
  );
};

News.propTypes = {};
