import React, { Fragment, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import classNames from 'classnames';
import { useNavigate, useLocation } from 'react-router-dom';

import { GameForId, AnimatedPreloader, TournamentsInfoShort } from '../../components';
import { ErrorsMain } from '../../elements';

import { setTournaments, setPageTitle } from '../../store/actions';
import { translateField, inViewGames } from '../../shared/utils';

import { Loader } from '../../components/UserProfile/Info/InfoStyles';
import { MISC_IMAGES_PATH, UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

const arrowFullLeft = `${UI_IMAGES_PATH}arrow-full-left.${UI_IMAGES_FORMAT}`;

export const TournamentsDetails = ({ tournament }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const words = useSelector((state) => state.words);
  const size = useSelector((state) => state.handling.size);

  const tournaments = useSelector((state) => state.tournaments);
  const data = tournaments?.list?.find((item) => item.id === tournament);
  const PAGE_TITLE = translateField('tournaments', 'tournaments.title', words, false);

  useEffect(() => {
    dispatch(setTournaments());
    dispatch(setPageTitle(PAGE_TITLE));

    return () => dispatch(setPageTitle(''));
  }, [dispatch, PAGE_TITLE]);

  const handleBack = () => {
    if (localStorage.getItem('current-bonus') === '/profile') {
      navigate('/profile?tab=bonuses');
    } else if (localStorage.getItem('current-bonus') === '/bonuses') {
      navigate('/tournaments');
    } else if (localStorage.getItem('current-bonus') === '/') {
      navigate('/');
    } else navigate('/tournaments');
    // if (location.state?.prevRoute) {
    //   navigate(location.state.prevRoute, { state: { TabsProfileGeneral: '2' } });
    // } else if (localStorage.getItem('current-bonus') === '/profile') {
    //   navigate(localStorage.getItem('current-bonus'));
    // } else {
    //   navigate(-1);
    // }
    localStorage.removeItem('current-bonus');
  };

  // * Slider
  const gameIdList = data?.games;
  const allGames = useSelector((state) => state.api.gamesList.games);
  const filteredGames = allGames?.filter((game) => gameIdList?.includes(game.id));

  const renderGameForId = useMemo(() => {
    if (!filteredGames?.length) return null;
    return (
      <Fragment>
        <div className="tournaments__details-games games">
          <div
            className="tournaments__details-games-title"
            style={{
              justifyContent: inViewGames(size) > gameIdList?.length ? 'center' : 'flex-start',
            }}
          >
            {translateField('tournaments_games_related', 'tournaments.message', words, false)}

            {inViewGames(size) < gameIdList?.length && (
              <div className="nav-slider">
                <div className={`arrow arrow--prev providers-slider__prev`}>
                  <img className="image" src={`${UI_IMAGES_PATH}arrow-small-left-white.${UI_IMAGES_FORMAT}`} style={{ width: '20px', height: '20px' }} alt="prev" />
                </div>
                <div className={`arrow arrow--next providers-slider__next`}>
                  <img
                    className="image"
                    src={`${UI_IMAGES_PATH}arrow-small-left-white.${UI_IMAGES_FORMAT}`}
                    style={{ width: '20px', height: '20px', transform: 'rotate(180deg)' }}
                    alt="next"
                  />
                </div>
              </div>
            )}
          </div>
          <div
            className={classNames('tournaments__details-games-list', {
              justifyCenter: inViewGames(size) > gameIdList?.length,
            })}
          >
            <GameForId id={gameIdList} />
          </div>
        </div>
      </Fragment>
    );
  }, [gameIdList, size, words, filteredGames]);

  // * Top Players
  const userId = useSelector((state) => state.api.account.id);

  const renderTopPlayers = useMemo(() => {
    const topPlayersData = data?.topPlayers;

    if (!topPlayersData) {
      return null;
    }

    const renderPlayers = topPlayersData.map((item, index) => {
      const { name, prize } = item;

      return (
        <div
          className={classNames('item', {
            active: userId === name,
          })}
          key={index}
        >
          <div className="item__account">
            {index + 1}. {translateField('player_id', 'tournaments.elements', words)}:{` ${name}`}
          </div>
          <div className="item__value">
            {translateField('prize', 'tournaments.elements', words)}: {prize}
          </div>
        </div>
      );
    });

    return (
      topPlayersData?.length !== 0 && (
        <div className="winners-list">
          <div className="winners-list_content">
            <div className="winners-list_title">{translateField('top_players', 'tournaments.elements', words)}</div>
            <div className="list">{renderPlayers}</div>
          </div>
        </div>
      )
    );
  }, [data, userId, words]);

  // * Pay Table
  const renderPayTable = useMemo(() => {
    const payTableData = data?.payTable;
    if (!payTableData) {
      return null;
    }

    const renderPlayers = payTableData.map((item, index) => {
      const { prize, count } = item;

      return (
        <div
          className={classNames('item', {
            active: userId === prize,
          })}
          key={index}
        >
          <div className="item__account">
            {index + 1}. {translateField('prize', 'tournaments.elements', words)}:{` ${prize}`}
          </div>
          <div className="item__value">
            {translateField('count', 'tournaments.elements', words)}: {count}
          </div>
        </div>
      );
    });

    return (
      payTableData?.length !== 0 && (
        <div className="winners-list">
          <div className="winners-list_content">
            <div className="winners-list_title">{translateField('pay_table', 'tournaments.elements', words)}</div>
            <div className="list">{renderPlayers}</div>
          </div>
        </div>
      )
    );
  }, [data, userId, words]);

  // * Description
  const renderDescription = useMemo(() => {
    const descrpt = data?.description;

    if (!descrpt) {
      return null;
    }

    return (
      <div className="information-tournament">
        <div className="title">{translateField('tournament_description', 'tournaments.elements', words)}</div>
        <p dangerouslySetInnerHTML={{ __html: descrpt ?? '' }} />
      </div>
    );
  }, [data, words]);

  const preloader = useMemo(
    () => (
      <div className="tournaments_loader">
        <AnimatedPreloader />
      </div>
    ),
    [],
  );

  if (!data?.id && tournaments.loading) return <ErrorsMain errorMessages={['error_tournaments_not_found']} styled="block" position="center" />;

  return (
    <div className="tournaments">
      {!data && !tournaments.loading ? (
        preloader
      ) : (
        <Fragment>
          <div className="tournaments__details">
            <div className="information">
              <img
                className="image-bg"
                src={`${MISC_IMAGES_PATH}tournaments/tournament-${data?.id}.webp`}
                alt="tournament"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              <div className="line">
                <div onClick={handleBack} className="link link-back">
                  <img src={arrowFullLeft} alt="back" />
                </div>
                <div className="badge" style={{ marginBottom: 0 }}>
                  {translateField(`tournaments_${data?.type}_tournament`, 'tournaments', words)}
                </div>
              </div>
              <TournamentsInfoShort
                item={data}
                view={{
                  timer: true,
                }}
              />
              {renderGameForId}
            </div>
            {data?.status === 'current' || data?.status === 'finished' ? renderTopPlayers : renderPayTable}
            {renderDescription}
          </div>
        </Fragment>
      )}
    </div>
  );
};
