import React, { Fragment, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { TournamentCountDown } from '../../../elements';

import { translateField } from '../../../shared/utils';
import { MISC_IMAGES_PATH } from '../../../shared/imagePathes';

export const TournamentsInfoShort = ({ item, view = {}, newDesign }) => {
  const words = useSelector((state) => state.words);
  const { timer = false, hiddenInfo = false, hiddenTimer = false, info = false } = view;

  // const account = useSelector((state) => state.account?.data);
  // const balanceFind = account?.balances?.find((balance) => balance?.currency === account?.currency);

  const list = useMemo(() => {
    if (!item) return null;
    const { start, end, winAmount, description } = item;

    const startDate = start?.split(' ')[0];
    const endDate = end?.split(' ')[0];
    const startTime = start?.split(' ')[1];
    const endTime = end?.split(' ')[1];

    switch (newDesign) {
      case true:
        return (
          <div className="info">
            {info && (
              <Fragment>
                {winAmount && (
                  <div className="win-amount">
                    {translateField('win_amount', 'tournaments.elements', words)}{' '}
                    <span className="sub-color">
                      {winAmount}
                      {/* {balanceFind?.currency} */}
                    </span>
                  </div>
                )}
              </Fragment>
            )}
            {start && end && !hiddenInfo && (
              <div className="date-timer">
                <div className="date-timer_title">
                  {translateField('start_date', 'tournaments.elements', words)}:{' '}
                  <span className="sub-color">{startDate?.replace(/-/g, '.')?.split('.')?.reverse()?.join('.')}</span>
                </div>
                {timer && !hiddenTimer && <TournamentCountDown startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} newDesign={newDesign} />}
              </div>
            )}
            {!timer && start && end && !hiddenTimer && (
              <div className="badge_small">
                <span>
                  <TournamentCountDown startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} newDesign={newDesign} />
                </span>
              </div>
            )}
            {info && <Fragment>{description && <div className="description">{description}</div>}</Fragment>}
          </div>
        );

      default:
        return (
          <Fragment>
            {start && end && !hiddenInfo && (
              <div className="date-timer">
                <div className="date-timer_title">
                  {translateField('start_date', 'tournaments.elements', words)} {startDate?.replace(/-/g, '.')?.split('.')?.reverse()?.join('.')}
                </div>
                {timer && <TournamentCountDown startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} />}
              </div>
            )}
            {!timer && start && end && !hiddenTimer && (
              <div className="badge_small">
                <img
                  alt="tournaments-circle"
                  className="icon"
                  src={`${MISC_IMAGES_PATH}tournaments/tournaments-circle.svg`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.remove();
                  }}
                />
                <span>
                  <TournamentCountDown startDate={startDate} endDate={endDate} startTime={startTime} endTime={endTime} />
                </span>
              </div>
            )}
          </Fragment>
        );
    }
  }, [words, item, timer, newDesign, hiddenInfo, hiddenTimer, info]);

  return list;
};
