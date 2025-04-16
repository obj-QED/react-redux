import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setTournaments } from '../../../store/actions';

export const TournamentsBanner = () => {
  const dispatch = useDispatch();

  const tournaments = useSelector((state) => state.tournaments);
  const [inquiryTournaments, setInquiryTournaments] = useState(false);

  useEffect(() => {
    if (!inquiryTournaments) {
      dispatch(setTournaments());
      setInquiryTournaments(true);
    }
  }, [dispatch, inquiryTournaments]);

  const renderTournamentsBanner = useMemo(() => {
    return (
      <Fragment>
        <div className="title">
          next <span>tournaments</span>
        </div>
        <div className="information">
          <div className="info">
            <div className="date">
              Date: <span className="green">22 November</span>
            </div>
            <div className="name">
              Name: <span className="green">Gansters Wednesday</span>
            </div>
          </div>

          <div className="prize">
            Prize: <span className="green">100000$</span>
          </div>
        </div>
      </Fragment>
    );
  }, []);

  return (
    <div className="tournaments">
      {tournaments.loading && (
        <Fragment>
          <div className="tournaments_banner">{renderTournamentsBanner}</div>
        </Fragment>
      )}
    </div>
  );
};
