import React, { useState, useEffect, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';

import AnimatedNumbers from 'react-animated-numbers';

import { translateField } from '../../shared/utils';
import { ButtonClose } from '../../elements';
import { JACKPOTS_WIN_IMAGES_PATH, JACKPOTS_WIN_IMAGES_FORMAT, UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

import { CoinAnimation } from './CoinAnimation/CoinAnimation';

const closeIcon = `${UI_IMAGES_PATH}close--red.${UI_IMAGES_FORMAT}`;

export const JackpotWinner = memo(() => {
  const words = useSelector((state) => state.words);
  const jackpots = useSelector((state) => state.jackpots);
  const hasWinner = useSelector((state) => state.jackpots?.winner);
  const size = useSelector((state) => state.handling.size);
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const [winner, setWinner] = useState({
    jackpots: '',
    playerId: '',
    cash: 0,
  });
  const [showJackpot, setShowJackpot] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  window.jackpotWin = {
    red: function (val) {
      // eslint-disable-next-line
      'use strict';

      document.body.style.overflow = 'hidden';

      setWinner({
        jackpots: val?.jackpot,
        playerId: val?.playerId,
        cash: val?.cash,
      });
      setAnimationKey((prevKey) => prevKey + 1); // Update the key for AnimatedNumbers
      setIsComponentVisible(true);
      setTimeout(() => {
        setShowJackpot(true);

        sessionStorage.setItem('jackpotWinner', 'true'); // Устанавливаем флаг показа джекпота в текущей сессии
      }, 500);
      setTimeout(() => {
        sessionStorage.removeItem('jackpotWinner'); // Устанавливаем флаг показа джекпота в текущей сессии
      }, 8000);
    },
  };

  useEffect(() => {
    const existingWinner = sessionStorage.getItem('jackpotWinner');

    if (!existingWinner) {
      if (hasWinner) {
        document.body.style.overflow = 'hidden';
        const winningJackpot = hasWinner;
        const newCash = typeof hasWinner.cash === 'string' ? parseFloat(hasWinner.cash).toFixed(2) : hasWinner.cash.toFixed(2);
        setWinner({
          jackpots: winningJackpot.key,
          playerId: winningJackpot?.playerId,
          cash: newCash,
        });
        setAnimationKey((prevKey) => prevKey + 1); // Update the key for AnimatedNumbers
        setIsComponentVisible(true);
        setTimeout(() => {
          setShowJackpot(true);
          sessionStorage.setItem('jackpotWinner', 'true'); // Устанавливаем флаг показа джекпота в текущей сессии
        }, 500);
      }
    }
    return () => {
      setAnimationKey(0);
      setWinner({
        jackpots: '',
        playerId: '',
        cash: 0,
      });
      setShowJackpot(false);
      setIsComponentVisible(false);
    };
  }, [jackpots, size, hasWinner]);

  const handleCloseClick = useCallback(() => {
    setIsComponentVisible(false);
    document.body.style.overflow = 'auto';
  }, []);

  useEffect(() => {
    const existingWinner = sessionStorage.getItem('jackpotWinner');
    if (!existingWinner) {
      if (!hasWinner) {
        setIsComponentVisible(false);
      }
    }
  }, [jackpots, hasWinner]);

  useEffect(() => {
    sessionStorage.removeItem('jackpotWinner'); // Удаляем флаг показа джекпота из сессии при изменении jackpots
  }, [jackpots]);

  useEffect(() => {
    if (!hasWinner || hasWinner?.cash === 0) return;
  }, [hasWinner, winner]);

  const sizeFontInAnimatedNumbers = () => {
    if (size.mobile) {
      if (size.landscape) return '10vh';
      else return '42px';
    } else {
      return '8vh';
    }
  };

  if (!isComponentVisible) return null;

  return (
    <div className="jackpot-winner">
      {showJackpot && (
        <div className="jackpot-winner__jackpot">
          {winner?.playerId && (
            <div className="jackpot-winner__user">
              {translateField('player', 'jackpots.winner', words, false)}
              {winner?.playerId}
            </div>
          )}
          <img src={`${JACKPOTS_WIN_IMAGES_PATH}${size.mobile ? 'mobile' : 'pc'}/${winner.jackpots}.${JACKPOTS_WIN_IMAGES_FORMAT}`} alt="" className="jackpot-winner__image" />
          <AnimatedNumbers
            key={animationKey}
            animateToNumber={winner.cash}
            fontStyle={{ fontSize: sizeFontInAnimatedNumbers(), fontWeight: 700, fontFamily: 'Arial, sans-serif' }}
            configs={(number, index) => {
              return {
                mass: 10 * (index + 1),
                tension: 60 * (index + 1),
                friction: 30 * (index + 1),
                duration: 5000,
              };
            }}
          />
        </div>
      )}
      <ButtonClose className="close" defaultIcon={false} noImage onClick={handleCloseClick}>
        <img src={closeIcon} alt="close" />
      </ButtonClose>
      <CoinAnimation jackpotsDir={JACKPOTS_WIN_IMAGES_PATH} jackpotsFormat={JACKPOTS_WIN_IMAGES_FORMAT} />
    </div>
  );
});
