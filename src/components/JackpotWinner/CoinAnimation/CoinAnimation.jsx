import React, { useState, useEffect } from 'react';

import './CoinAnimation.scss';

const generateCoinFrames = (dir, format) => {
  return Array.from({ length: 6 }, (_, i) => `${dir}coins/coin${i + 1}.${format}`);
};

export const CoinAnimation = ({ jackpotsDir, jackpotsFormat }) => {
  const [animationClass, setAnimationClass] = useState('');
  const [coins, setCoins] = useState([]);

  const coinFrames = generateCoinFrames(jackpotsDir, jackpotsFormat);

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setAnimationClass('animate');
    }, 1000);

    const initialCoins = Array.from({ length: 25 }, (_, index) => {
      return {
        frameIndex: 0,
        left: `${Math.random() * 95 + 5}%`,
        top: `${Math.random() * 100 - 120}%`,
      };
    });
    // Функция для перемешивания массива
    const shuffleArray = (array) => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    const shuffledFrames = shuffleArray(coinFrames);

    setCoins(initialCoins);

    // Изменяем кадры каждой монетки каждые 100 миллисекунд
    const frameIntervals = initialCoins.map((_, index) => {
      return setInterval(() => {
        setCoins((prevCoins) => {
          const newCoins = [...prevCoins];
          newCoins[index] = {
            frameIndex: (prevCoins[index].frameIndex + 1) % shuffledFrames.length,
            left: prevCoins[index].left,
            top: prevCoins[index].top,
          };
          return newCoins;
        });
      }, 80);
    });

    return () => {
      clearTimeout(animationTimeout);
      frameIntervals.forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coinFrames.length]);

  return (
    <div className={`coin-animation-container ${animationClass}`}>
      {coins.map((coin, index) => (
        <div
          key={index}
          className={`coin-image coin-${index + 1}`}
          style={{
            backgroundImage: `url(${coinFrames[coin.frameIndex]})`,
            left: coin.left,
            top: coin.top,
          }}
        />
      ))}
    </div>
  );
};
