import { useEffect, useState } from 'react';
import './Odometer.scss';

export const Odometer = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(generateRandomNumber(value));

  const valueArray = displayValue.toString().split('');

  useEffect(() => {
    setTimeout(() => {
      setDisplayValue(value);
    }, 150);
  }, [value]);

  return (
    <div className="odometer_wrapper">
      {valueArray.map((val, idx) => (
        <div
          key={idx}
          className="odometer_digits"
          style={{
            marginTop: val.match(/[0-9]/) ? `calc(-${val}em)` : 0,
            transition: `${duration}ms all`,
            transitionDelay: `${(valueArray.length - idx) * 20}ms`,
          }}
        >
          {val.match(/[0-9]/) ? (
            <>
              {[...Array(10).keys()].map((num) => (
                <div key={num} className="odometer_digit" data-val={num}>
                  {num}
                </div>
              ))}
            </>
          ) : (
            <div className="odometer_separator">{val}</div>
          )}
        </div>
      ))}
    </div>
  );
};

function generateRandomNumber(target) {
  const targetString = target.toString();
  const randomValue = targetString.replace(/[0-9]/g, () => Math.floor(Math.random() * 10));
  return parseFloat(randomValue);
}
