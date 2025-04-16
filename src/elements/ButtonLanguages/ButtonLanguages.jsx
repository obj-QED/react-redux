import React, { useRef, useState, memo, useMemo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import ReactInlineSvg from 'react-inlinesvg';

import { getWords, profileUpdateRequest, getPage } from '../../store/actions';
import { translateField } from '../../shared/utils';
import { useOutsideClick } from '../../hooks';

import { UI_IMAGES_PATH, UI_IMAGES_FORMAT, LANGUAGES_IMAGES_PATH, LANGUAGES_IMAGES_FORMAT } from '../../shared/imagePathes';

export const ButtonLanguages = memo(({ direction, title }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const apiLanguagesList = useSelector((state) => state.api?.languages);
  const apiLanguage = useSelector((state) => state.api?.language);
  const words = useSelector((state) => state.words);
  const ref = useRef(null);
  const tokenLS = localStorage.getItem('user-token');
  const languageLS = localStorage.getItem('current-lang');
  const token = localStorage.getItem('user-token');
  const [currentLang, setCurrentLang] = useState(() => (!tokenLS && languageLS) || apiLanguage);

  const [opened, setOpened] = useState(false);

  const handleChangeLanguage = useCallback(
    (lang) => {
      setOpened(false);
      setCurrentLang(lang);
      localStorage.setItem('current-lang', lang);
      dispatch(getWords(lang));
      token && dispatch(profileUpdateRequest({ data: { language: lang } }));
      dispatch(getPage(location.pathname));

      setCurrentLang(lang); // force update of language
    },
    [dispatch, token, location.pathname],
  );

  const languageButton = useMemo(() => {
    return (
      <div className="trigger" onClick={() => setOpened(!opened)}>
        <div className={`flag ${currentLang}`}>
          <img
            className="image"
            src={`${LANGUAGES_IMAGES_PATH}${currentLang}.${LANGUAGES_IMAGES_FORMAT}`}
            alt={`flag-image_${currentLang}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.remove();
            }}
          />
          <span className="name">
            {translateField(currentLang, words, false)}
            <ReactInlineSvg cacheRequests className="arrow" src={`${UI_IMAGES_PATH}arrow__down.${UI_IMAGES_FORMAT}`} title="lang" description="arrow" />
          </span>
        </div>
      </div>
    );
  }, [currentLang, words, opened]);

  const languagesList = useMemo(() => {
    return (
      <div className="list">
        {apiLanguagesList?.map((lang) => (
          <div key={lang} className={`flag flag_${lang}`} onClick={() => handleChangeLanguage(lang)}>
            <img
              className="image"
              src={`${LANGUAGES_IMAGES_PATH}${lang}.${LANGUAGES_IMAGES_FORMAT}`}
              alt={`flag-image_${lang}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.remove();
              }}
            />
            <div className="name">{translateField(lang, words, false)}</div>
          </div>
        ))}
      </div>
    );
  }, [words, apiLanguagesList, handleChangeLanguage]);

  useOutsideClick(ref, () => setOpened(false), opened);

  // Effect to update currentLang when language changes
  useEffect(() => {
    setCurrentLang(apiLanguage);
  }, [apiLanguage]);

  const apiLanguagesListNotEmpty = apiLanguagesList?.length > 1;
  if (!apiLanguagesListNotEmpty) return null;

  return (
    <>
      {Boolean(title) && <div className="button-language_title">{translateField('language', words)}</div>}
      <div ref={ref} className={classNames('button-language')} data-opened={opened} data-direction={direction}>
        {languageButton}
        {opened && languagesList}
      </div>
    </>
  );
});
