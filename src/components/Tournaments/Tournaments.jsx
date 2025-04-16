import React, { Fragment, useRef, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation, Link } from 'react-router-dom';
import classnames from 'classnames';

import { AnimatedPreloader, TournamentsInfoShort } from '../../components';

import { setTournaments, setPageTitle } from '../../store/actions';
import { translateField } from '../../shared/utils';

import { ErrorBlock, Error } from '../Games/Grid/GridStyles';
import { MISC_IMAGES_PATH, UI_IMAGES_PATH } from '../../shared/imagePathes';

const bgWave = `${UI_IMAGES_PATH}bg_wave.png`;

export const Tournaments = () => {
  const refToBonusItems = useRef([]);

  const dispatch = useDispatch();
  const location = useLocation();

  const settings = useSelector((state) => state.settings);
  const newDesign = settings?.tournamentsNewDesign ?? false;

  // const settings = useSelector((state) => state.settings);
  const handling = useSelector((state) => state.handling);
  const size = useSelector((state) => state.handling.size);

  const words = useSelector((state) => state.words);
  const tournaments = useSelector((state) => state.tournaments);
  const PAGE_TITLE = translateField('tournaments', 'tournaments.title', words, false);

  const [inquiryTournaments, setInquiryTournaments] = useState(false);

  useEffect(() => {
    if (!tournaments.list && !inquiryTournaments) {
      dispatch(setTournaments());
      setInquiryTournaments(true);
    }
    dispatch(setPageTitle(PAGE_TITLE));

    return () => dispatch(setPageTitle(''));
  }, [dispatch, PAGE_TITLE, tournaments.list, inquiryTournaments]);

  const filterParam = useMemo(() => {
    // Get all unique types from tournaments data
    const typesFromTournaments = new Set(tournaments.list?.map((tournament) => tournament.status));

    // Add 'current' if it's not already included
    const filters = ['all', 'upcoming', 'finished', 'current'];

    // Add any additional types found in tournaments data
    typesFromTournaments.forEach((status) => {
      if (!filters.includes(status)) {
        filters.push(status);
      }
    });

    return filters;
  }, [tournaments.list]);

  const handleFilterClick = (selectedFilter) => {
    localStorage.setItem('tournaments-current-filter', selectedFilter);
    setFilter(selectedFilter);
  };

  const [filter, setFilter] = useState(localStorage.getItem('tournaments-current-filter') ?? 'current');

  const filteredList = useMemo(() => {
    if (filter === 'all') {
      return tournaments?.list;
    } else {
      return tournaments?.list?.filter((tournament) => tournament?.status?.toLowerCase() === filter?.toLowerCase());
    }
  }, [filter, tournaments?.list]);

  useEffect(() => {
    const updateMaxHeight = () => {
      if (refToBonusItems.current.length > 0) {
        const heights = refToBonusItems.current.map((ref) => parseFloat(ref?.getBoundingClientRect().height.toFixed(2)) || 0);
        const maxHeight = parseFloat(Math.max(...heights).toFixed(2));
        refToBonusItems.current.forEach((ref) => {
          if (ref) {
            ref.style.minHeight = `${maxHeight.toFixed(2)}px`;
          }
        });
      }
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);

    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };
  }, [refToBonusItems, tournaments, inquiryTournaments, filter]);

  const renderedList = useMemo(() => {
    const uniqueIds = new Set();
    return filteredList?.map((tournament, index) => {
      const { id, name, logo, type, status } = tournament;

      if (uniqueIds.has(id)) {
        return null;
      }

      uniqueIds.add(id);

      switch (newDesign) {
        case true:
          return (
            <div
              className={classnames('tournaments_item item', {
                tournaments_item_small: settings?.humburgerMenu?.staticPosition && handling?.openMenu && !size.mobile,
                [type]: type,
              })}
              id={id}
              key={index}
              data-type={type}
              data-status={status}
              ref={(el) => (refToBonusItems.current[index] = el)}
            >
              <div className="information">
                <div className="badge">{translateField(`tournaments_${type}_tournament`, 'tournaments', words)}</div>
                {name && <h3 className="title">{name}</h3>}
                <img
                  className="bg_wave"
                  src={bgWave}
                  alt="bg_wave"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
                <img
                  className="image"
                  src={logo}
                  alt="tournament"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${MISC_IMAGES_PATH}placeholder.webp`;
                    // e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="bottom-info">
                <div className="content">
                  <TournamentsInfoShort
                    item={tournament}
                    view={{
                      hiddenTimer: true,
                      info: true,
                    }}
                    newDesign={newDesign}
                  />
                </div>
                <div className="content-footer">
                  <TournamentsInfoShort
                    item={tournament}
                    view={{
                      hiddenInfo: true,
                    }}
                    newDesign={newDesign}
                  />
                  <div className="btn-block">
                    <Link
                      className={classnames('handle link', {
                        deactive: status === 'finished',
                      })}
                      to={`/tournaments/${id}`}
                      state={{ prevRoute: location.pathname }}
                    >
                      <span>{translateField('tournaments_btn_play', 'tournaments.button', words)}</span>
                    </Link>
                    <Link className="details link" to={`/tournaments/${id}`} state={{ prevRoute: location.pathname }}>
                      <span>{translateField('tournaments_btn_details', 'tournaments.button', words)}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div
              className={classnames('tournaments_item item', { tournaments_item_small: settings?.humburgerMenu?.staticPosition && handling?.openMenu && !size.mobile })}
              id={id}
              key={index}
              data-type={type}
              data-status={status}
            >
              <div className="badge">{translateField(`tournaments_${type}_tournament`, 'tournaments', words)}</div>
              {name && <h3 className="title">{name}</h3>}
              <img
                className="image"
                src={logo}
                alt="tournament"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${MISC_IMAGES_PATH}placeholder.webp`;
                  // e.target.style.display = 'none';
                }}
              />
              <TournamentsInfoShort item={tournament} />
              <div className="info-short">
                <Link
                  className={classnames('handle link', {
                    deactive: status === 'finished',
                  })}
                  to={`/tournaments/${id}`}
                  state={{ prevRoute: location.pathname }}
                >
                  <span>{translateField('tournaments_btn_play', 'tournaments.button', words)}</span>
                </Link>
                <Link className="details link" to={`/tournaments/${id}`} state={{ prevRoute: location.pathname }}>
                  <span>{translateField('tournaments_btn_details', 'tournaments.button', words)}</span>
                </Link>
              </div>
            </div>
          );
      }
    });
  }, [filteredList, location.pathname, words, settings?.humburgerMenu?.staticPosition, handling?.openMenu, size.mobile, newDesign]);

  const preloader = useMemo(
    () => (
      <div className="tournaments_loader">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  return (
    <div
      className={classnames('tournaments', {
        'new-design': newDesign,
      })}
    >
      <div className="tournaments_title">
        <span>{PAGE_TITLE}</span>
      </div>
      <div className="tournaments_navigation">
        <div className="filter">
          {filterParam.map((item) => (
            <div key={item} className={classnames('item', { active: filter === item })} onClick={() => handleFilterClick(item)}>
              {translateField(`filter_${item}`, 'tournaments.filter', words)}
            </div>
          ))}
        </div>
      </div>
      {!tournaments.loading ? (
        preloader
      ) : (
        <Fragment>
          {!tournaments.error && renderedList ? (
            <Fragment>
              {filteredList && filteredList.length > 0 ? ( // Check if filteredList is not empty
                <div className="tournaments_list">{renderedList}</div>
              ) : (
                <ErrorBlock>
                  <Error>{translateField('no_tournaments_available', 'tournaments.error', words)}</Error>
                </ErrorBlock>
              )}
            </Fragment>
          ) : (
            <ErrorBlock>
              <Error>{translateField(tournaments.error ?? 'error_tournaments_not_found', 'tournaments.error', words)}</Error>
            </ErrorBlock>
          )}
        </Fragment>
      )}
    </div>
  );
};
