import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Helmet } from 'react-helmet';

const HelmetComponent = () => {
  const domain = window.location.hostname;
  const metaFromRedux = useSelector((state) => state.meta);

  useEffect(() => {
    // Записываем данные из Redux в localStorage при каждом обновлении metaFromRedux
    localStorage.setItem('meta', JSON.stringify(metaFromRedux));
  }, [metaFromRedux]);

  // Получаем данные из localStorage
  const metaFromLocalStorage = JSON.parse(localStorage.getItem('meta')) || {};
  return (
    <Helmet>
      {/* Используем данные из Redux, если они доступны, иначе используем данные из localStorage или значения по умолчанию */}
      <title>{metaFromRedux?.title || metaFromLocalStorage?.title || domain}</title>
      <meta name="description" content={metaFromRedux?.description || metaFromLocalStorage?.description || ''} />
      <meta name="keywords" content={metaFromRedux?.keywords || metaFromLocalStorage?.keywords || ''} />
      <meta name="content" content={metaFromRedux?.content || metaFromLocalStorage?.content || ''} />
    </Helmet>
  );
};

export default HelmetComponent;
