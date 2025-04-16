import React, { Fragment, Children, memo } from 'react';
import PropTypes from 'prop-types';
import './Dropdown.scss';

/**
 * Компонент Heading - представляет собой заголовок выпадающего списка.
 *
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние элементы компонента Heading.
 * @returns {JSX.Element} - Возвращает разметку компонента Heading.
 */
const Heading = ({ children }) => <Fragment>{children}</Fragment>;

Heading.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Компонент Content - представляет собой содержимое выпадающего списка.
 *
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние элементы компонента Content.
 * @returns {JSX.Element} - Возвращает разметку компонента Content.
 */
const Content = ({ children }) => <Fragment>{children}</Fragment>;

Content.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Note: Компонент Dropdown - представляет собой выпадающий список.
 *
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние элементы компонента, включая компоненты Heading и Content.
 * @param {boolean} props.opened - Флаг, указывающий, открыт ли выпадающий список.
 * @param {Function} props.onClick - Функция обратного вызова при клике на заголовок выпадающего списка.
 * @param {string} props.className - Дополнительные классы для стилизации компонента.
 * @param {string} props.dropdownKey - Ключ для компонента.
 *
 */
const DropdownComponent = ({ children, opened, onClick, className, dropdownKey }) => {
  // Извлекаем компоненты Heading и Content из дочерних элементов
  const heading = Children.toArray(children).find((child) => child.type === Heading);
  const content = Children.toArray(children).find((child) => child.type === Content);

  // Обработчик клика на заголовок выпадающего списка
  const handleToggle = (e) => {
    if (onClick) {
      onClick(!opened);
    }
    e.stopPropagation();
  };

  // Возвращаем разметку компонента Dropdown
  return (
    <div className={`dropdown ${className || ''}`} data-opened={opened} key={dropdownKey}>
      {heading && (
        <div className="dropdown__heading" onClick={handleToggle}>
          {heading}
        </div>
      )}
      {content && <div className="dropdown__content">{content}</div>}
    </div>
  );
};

DropdownComponent.propTypes = {
  children: PropTypes.node.isRequired,
  dropdownKey: PropTypes.string,
  className: PropTypes.string,
  opened: PropTypes.bool,
  onClick: PropTypes.func,
};

export const Dropdown = memo(DropdownComponent);

// Экспорт компонентов Heading и Content для использования в компоненте Dropdown
Dropdown.Heading = Heading;
Dropdown.Content = Content;
