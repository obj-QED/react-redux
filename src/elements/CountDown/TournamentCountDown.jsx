import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { differenceInSeconds, parse, startOfDay } from 'date-fns';

import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const timeIcon = `${UI_IMAGES_PATH}time.${UI_IMAGES_FORMAT}`;

export const TournamentCountDown = memo(({ startTime, endTime, startDate, endDate, content, newDesign, className }) => {
  const words = useSelector((state) => state.words);
  const [over, setOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const updateTimeLeft = useCallback((timeDiffInSeconds) => {
    if (timeDiffInSeconds <= 0) {
      setOver(true);
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    } else {
      const days = Math.floor(timeDiffInSeconds / (24 * 3600));
      const hours = Math.floor((timeDiffInSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((timeDiffInSeconds % 3600) / 60);
      const seconds = timeDiffInSeconds % 60;
      setTimeLeft({ days, hours, minutes, seconds });
    }
  }, []);

  const startDateTime = useMemo(() => parse(`${startDate} ${startTime}`, 'yyyy-MM-dd HH:mm:ss', new Date()), [startDate, startTime]);
  const endDateTime = useMemo(() => parse(`${endDate} ${endTime}`, 'yyyy-MM-dd HH:mm:ss', new Date()), [endDate, endTime]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();

      if (now < startDateTime) {
        setOver(false);
        const timeDiffInSeconds = differenceInSeconds(endDateTime, now);
        updateTimeLeft(timeDiffInSeconds);
        return;
      }

      const timeDiffInSeconds = differenceInSeconds(endDateTime, now);

      if (timeDiffInSeconds <= 0) {
        setOver(true);
      } else {
        updateTimeLeft(timeDiffInSeconds);
      }
    };

    const timerID = setInterval(tick, 1000);
    return () => clearInterval(timerID);
  }, [endDateTime, startDateTime, updateTimeLeft]);

  useEffect(() => {
    const now = new Date();
    const startDiffInSeconds = differenceInSeconds(startDateTime, startOfDay(now));

    if (startDiffInSeconds > 0) {
      setOver(false);
      const timeDiffInSeconds = differenceInSeconds(endDateTime, now);
      updateTimeLeft(timeDiffInSeconds);
      return;
    }

    const timeDiffInSeconds = differenceInSeconds(endDateTime, now);

    if (timeDiffInSeconds <= 0) {
      setOver(true);
    } else {
      updateTimeLeft(timeDiffInSeconds);
    }
  }, [startDateTime, endDateTime, updateTimeLeft]);

  if (!startDate || !endDate || !startTime || !endTime) return null;

  switch (newDesign) {
    case true:
      return (
        <>
          {over && (
            <div
              className={classNames('timer', {
                [className]: className,
                over,
              })}
            >
              <img
                src={timeIcon}
                alt="time-over"
                className="timer__icon"
                style={{
                  marginBottom: '2px',
                }}
              />
              {translateField('time_is_over', words)}
            </div>
          )}
          {!over && (
            <div
              className={classNames('timer', {
                [className]: className,
              })}
            >
              <div className="time">
                <span className="item">
                  <span className="number">{timeLeft.days}</span>
                  <small>dd</small>
                </span>
                <span className="item">
                  <span className="number">{timeLeft.hours}</span>
                  <small>hh</small>
                </span>
                <span className="item">
                  <span className="number">{timeLeft.minutes}</span>
                  <small>mm</small>
                </span>
                <span className="item">
                  <span className="number">{timeLeft.seconds}</span>
                  <small>ss</small>
                </span>
              </div>
            </div>
          )}
        </>
      );

    default:
      return (
        <>
          {over && (
            <div
              className={classNames('timer', {
                [className]: className,
              })}
            >
              {translateField('time_is_over', words)}
            </div>
          )}
          {!over && (
            <div
              className={classNames('timer', {
                [className]: className,
              })}
            >
              {content && (
                <>
                  <img src={timeIcon} alt="" className="timer__icon" />
                  <div className="text">{content.btn}</div>
                </>
              )}
              <div className="time">
                {timeLeft.days > 0 && `${timeLeft.days}d:`}
                {`${timeLeft.hours.toString().padStart(2, '0')}h:${timeLeft.minutes.toString().padStart(2, '0')}m:${timeLeft.seconds.toString().padStart(2, '0')}s`}
              </div>
            </div>
          )}
        </>
      );
  }
});

TournamentCountDown.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  content: PropTypes.object,
};
