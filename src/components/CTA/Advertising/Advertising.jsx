import React, { memo, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { ButtonsEl } from '../../../elements';
import { translateField } from '../../../shared/utils';

export const Advertising = memo(({ data }) => {
  const words = useSelector((state) => state.words);

  const handleClick = useCallback(() => {
    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, [data]);

  if (!data.text && !data.button) return null;

  return (
    <div className="advertising">
      {data.text && <div className="advertising-title">{translateField(data.text, 'basic', words)}</div>}
      {data.img && (
        <img
          className="advertising-image"
          src={data?.img}
          alt="advertising_image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.style.display = 'none';
          }}
        />
      )}
      {data.button && (
        <ButtonsEl onClick={handleClick} className="advertising-btn">
          {translateField(data.button, 'basic', words)}
        </ButtonsEl>
      )}
    </div>
  );
});
