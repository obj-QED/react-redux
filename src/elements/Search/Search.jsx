import React, { useCallback, useEffect, useState, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation } from 'react-router-dom';
import ReactInlineSvg from 'react-inlinesvg';
import classNames from 'classnames';

import { setSearchGameList } from '../../store/actions';
import { translateField } from '../../shared/utils';

import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';
import { useOutsideClick } from '../../hooks';

const closeIcon = `${UI_IMAGES_PATH}close.${UI_IMAGES_FORMAT}`;
const searchIcon = `${UI_IMAGES_PATH}search.${UI_IMAGES_FORMAT}`;

export const Search = memo(() => {
  const location = useLocation();
  const words = useSelector((state) => state.words);
  const dispatch = useDispatch();
  const gamesList = useSelector((state) => state.api?.gamesList?.games);
  const searchResult = useSelector((state) => state.searchResult);
  const searchRef = useRef(null);

  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  // Обработчик нажатия клавиши Esc
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && open) {
        if (!value) {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [open, value]);

  useOutsideClick(
    searchRef,
    () => {
      if (!value) {
        setOpen(false);
      }
    },
    open,
  );

  // Фильтрация списка игр по поисковому запросу
  const arraySearch = useCallback((array, keyword) => {
    const searchTerm = keyword.toLowerCase();
    return array
      ?.filter((game) => game.name.toLowerCase().startsWith(searchTerm))
      .concat(array?.filter((game) => game.name.toLowerCase().includes(searchTerm) && !game.name.toLowerCase().startsWith(searchTerm)));
  }, []);

  // Обработчик изменения значения в поисковой строке
  const filterList = useCallback(
    (e) => {
      const value = e.target.value;
      setValue(value);

      if (value?.length > 2) {
        const search = arraySearch(gamesList, value);
        dispatch(setSearchGameList(search, value));
      } else {
        dispatch(setSearchGameList([], ''));
      }
    },
    [arraySearch, dispatch, gamesList],
  );

  // Очистка поискового запроса и закрытие строки поиска
  const clearTerm = useCallback(() => {
    setValue('');
    dispatch(setSearchGameList([], ''));
  }, [dispatch]);

  // Очистка результатов поиска при изменении маршрута
  useEffect(() => {
    return () => {
      dispatch(setSearchGameList([], ''));
      clearTerm();
    };
  }, [location.pathname, dispatch, clearTerm]);

  useEffect(() => {
    !Boolean(searchResult?.query) && setValue(''); // Если поисковый запрос пустой, то очищаем значение поискового запроса и
  }, [searchResult?.query]);

  return (
    <div
      ref={searchRef}
      className={classNames('search', {
        'search--focused': open || value,
      })}
    >
      <input
        id={'search-game'}
        name={'search-game'}
        className="search-input"
        placeholder={!open || searchResult.query === '' ? translateField('search_placeholder', words, false) : null}
        type="text"
        value={value ?? searchResult?.query}
        onChange={filterList}
        onFocus={() => {
          setOpen(true);
        }}
      />
      <ReactInlineSvg cacheRequests className="icon" src={searchIcon} />
      <ReactInlineSvg
        cacheRequests
        className={classNames('clear', {
          'clear--active': value ?? searchResult?.query,
        })}
        src={closeIcon}
        onClick={clearTerm}
      />
    </div>
  );
});
