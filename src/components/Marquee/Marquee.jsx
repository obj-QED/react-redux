import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCssVariableValue } from '../../shared/utils';

const WIDTH_ONE_CHAR = 8; // 1 char ~ 8px

export const Marquee = () => {
  const width = useSelector((state) => state.handling?.size?.width);
  const contentArray = useSelector((state) => state.api.tickers) || [];
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    const totalTextLength = contentArray.reduce((acc, item) => acc + item.text.length, 0);
    const speed = parseFloat(getCssVariableValue('--marquee-animation-speed')) || 10;
    const duration = (totalTextLength + width / WIDTH_ONE_CHAR) / speed;
    setDuration(duration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  if (contentArray.length === 0) return null;

  return (
    <div className="marquee">
      <div className="marquee-content" style={{ animationDuration: `${duration}s` }}>
        {contentArray.map((item, idx) => (
          <span key={idx}>{item.text}</span>
        ))}
      </div>
    </div>
  );
};
