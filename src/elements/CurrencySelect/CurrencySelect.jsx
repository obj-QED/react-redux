import React, { useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import ReactInlineSvg from 'react-inlinesvg';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

import './CurrencySelect.scss';

/**
 * Note: Компонент CurrencySelect - выпадающий список для выбора валюты.
 *
 * @component
 * @param {Object} props - Свойства компонента.
 * @param {string} props.selected - Выбранная валюта.
 * @param {string} props.className - Дополнительные классы для стилизации.
 * @param {Function} props.onChange - Функция обратного вызова при изменении выбранной валюты.
 * @param {string[]} props.currencies - Массив доступных валют.
 * @returns {JSX.Element} - Возвращает разметку компонента CurrencySelect.
 */
const CurrencySelect = ({ selected, className, onChange, currencies }) => {
  /**
   * Генерирует разметку для элементов выпадающего списка.
   * @param {string[]} currencies - Массив валют.
   * @returns {JSX.Element[]} - Возвращает массив элементов JSX для валют.
   */
  const renderElements = useCallback(
    (currencies) => {
      return currencies.map((element) => (
        <option key={`currency_${element}`} value={element} {...(selected === element && { selected })}>
          {element}
        </option>
      ));
    },
    [selected],
  );

  return (
    <div className={`CurrencySelect ${className}`}>
      <select disabled={currencies.length <= 1} onChange={onChange}>
        {currencies.length > 1 && !selected && (
          <option key="currency_placeholder" value={0}>
            Currency
          </option>
        )}
        {renderElements(currencies)}
      </select>
      <ReactInlineSvg cacheRequests className="arrow" src={`${UI_IMAGES_PATH}arrow.${UI_IMAGES_FORMAT}`} />
    </div>
  );
};

CurrencySelect.propTypes = {
  selected: PropTypes.string, // Выбранная валюта
  className: PropTypes.string, // Дополнительные классы для стилизации
  onChange: PropTypes.func, // Функция обратного вызова при изменении выбранной валюты
  currencies: PropTypes.arrayOf(PropTypes.string).isRequired, // Массив доступных валют
};

export default memo(CurrencySelect);
