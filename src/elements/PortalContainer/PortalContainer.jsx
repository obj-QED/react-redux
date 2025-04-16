import { useState, useEffect, forwardRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Note: Компонент PortalContainer - представляет контейнер для портала, используемого для рендеринга дочерних компонентов в другом DOM-контейнере.
 *
 * @param {Object} props - Свойства компонента.
 * @param {JSX.Element} props.children - Дочерние компоненты, которые будут отрендерены внутри портала.
 * @param {string} props.id - Идентификатор контейнера (необязательный).
 * @param {string} props.selector - Селектор для поиска родительского элемента, внутри которого будет создан портал (необязательный).
 * @param {string} props.className - Дополнительные классы для стилизации контейнера (необязательный).
 * @param {boolean} props.returnChildren - Флаг, указывающий, нужно ли возвращать дочерние компоненты напрямую без портала (необязательный).
 * @param {Object} props.style - Стили для контейнера (необязательный).
 * @param {React.RefObject} props.forwardedRef - Ссылка на объект, в который будет сохранен DOM-элемент контейнера (необязательный).
 *
 */
const PortalContainer = forwardRef(({ children, id, selector, className, returnChildren, style }, forwardedRef) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (returnChildren) return;

    const portalContainer = document.createElement('div');
    portalContainer.id = id || '';

    if (className) {
      portalContainer.classList.add(className);
    }

    if (style) {
      Object.assign(portalContainer.style, style);
    }

    setContainer(portalContainer);

    const parentElement = selector ? document.querySelector(selector) : document.body;

    parentElement?.appendChild(portalContainer);

    return () => {
      if (portalContainer && portalContainer.parentNode) {
        portalContainer.parentNode.removeChild(portalContainer);
      }
    };
  }, [returnChildren, className, id, selector, style]);

  useEffect(() => {
    if (forwardedRef) {
      forwardedRef.current = container;
    }
  }, [container, forwardedRef]);

  return returnChildren ? children : container && createPortal(children, container);
});

export default PortalContainer;
