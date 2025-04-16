import React, { useCallback, memo, useMemo, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactInlineSvg from 'react-inlinesvg';
import { CheckboxCustom } from '../../elements';
import { translateField } from '../../shared/utils';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';
import { FieldInput } from '../../components/Auth/assets/FormStyles';
import classNames from 'classnames';

const plus21 = `${UI_IMAGES_PATH}21-plus.${UI_IMAGES_FORMAT}`;

/**
 * Note: Компонент AcceptTerms - компонент для отображения и обработки согласия с условиями.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {function} props.onChange - Обработчик изменения согласия.
 * @param {string} props.error - Сообщение об ошибке.
 * @param {boolean} props.termsChecked - Флаг согласия.
 * @returns {JSX.Element} - Возвращает разметку компонента AcceptTerms.
 */
export const AcceptTerms = memo(({ className, onChange, error, termsChecked, keyLang = 'terms_and_conditions' }) => {
  const words = useSelector((state) => state.words);

  const handleChange = useCallback(() => {
    onChange(!termsChecked); // Call onChange with the new value
  }, [onChange, termsChecked]);

  const translatedAccept = useMemo(() => translateField('accept', words, false), [words]);
  const translatedTerms = useMemo(() => translateField(keyLang, words, false), [words, keyLang]);

  const description = useMemo(() => {
    switch (keyLang) {
      case 'terms_and_conditions':
        return (
          <Fragment>
            <ReactInlineSvg cacheRequests src={plus21} title="plus-21" />
            {translatedAccept} <Link to="/terms">{translatedTerms}</Link>
          </Fragment>
        );

      default:
        return translatedTerms;
    }
  }, [keyLang, translatedAccept, translatedTerms]);

  return (
    <FieldInput
      className={classNames('auth-form-terms', {
        [className]: className,
      })}
      key={keyLang}
    >
      <CheckboxCustom checked={termsChecked} onChange={handleChange} key={keyLang} required />
      <span>{description}</span>
      {error && <div className="error error--terms">{(translateField(`you_must_accept_the_${keyLang}`, words, false), [words])}</div>}
    </FieldInput>
  );
});
