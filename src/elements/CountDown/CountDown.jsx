import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import { translateField } from '../../shared/utils';

const formatTime = (seconds) => {
  if (seconds <= 0) return null;
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return { days, hours, minutes, secs };
};

const formatTimeLast = (seconds, words) => {
  if (seconds <= 0) return null;
  const days = Math.floor(seconds / 86400);
  const hours = String(Math.floor((seconds % 86400) / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return days > 0 ? `${translateField('days', words, false)}:${days}${hours}:${minutes}:${secs}` : `${hours}:${minutes}:${secs}`;
};

export const CountDown = ({ initialSeconds = 0, message = null, newDesign }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const intervalId = useRef(null);
  const words = useSelector((state) => state.words);

  useEffect(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }

    setSecondsLeft(initialSeconds);

    intervalId.current = setInterval(() => {
      setSecondsLeft((prevSeconds) => {
        if (prevSeconds < 1) {
          clearInterval(intervalId.current);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [initialSeconds]);

  const currentTimer = newDesign ? formatTime(secondsLeft) : formatTimeLast(secondsLeft, words);

  return currentTimer !== null ? (
    newDesign ? (
      <div
        className={classNames('countdown', {
          'countdown--new-design': newDesign,
        })}
      >
        <span className="countdown__item">
          <span className="time">{currentTimer.days}</span>
          <small>dd</small>
        </span>
        <span className="countdown__item">
          <span className="time">{currentTimer.hours.toString().padStart(2, '0')}</span>
          <small>hh</small>
        </span>
        <span className="countdown__item">
          <span className="time">{currentTimer.minutes.toString().padStart(2, '0')}</span>
          <small>mm</small>
        </span>
        <span className="countdown__item">
          <span className="time">{currentTimer.secs.toString().padStart(2, '0')}</span>
          <small>ss</small>
        </span>
      </div>
    ) : (
      <span className="countdown">{currentTimer}</span>
    )
  ) : (
    message && <span className="countdown message">{message}</span>
  );
};

CountDown.propTypes = {
  initialSeconds: PropTypes.number,
};
