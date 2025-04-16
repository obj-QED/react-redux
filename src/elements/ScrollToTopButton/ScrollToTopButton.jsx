import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';
import './ScrollToTopButton.scss';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../shared/imagePathes';

export const ScrollToTopButton = memo(({ style }) => {
  const size = useSelector((state) => state.handling.size);
  const [isVisible, setIsVisible] = useState(false);

  // Мемоизированный колбэк для обработки события прокрутки
  const handleScroll = useCallback(() => {
    const viewContainer = document.querySelector('.view');
    const scrolled = viewContainer?.scrollTop || 0;

    // Определение, когда кнопка должна стать видимой
    const shouldBeVisible = scrolled > (!size.mobile ? window.innerHeight / 2 : window.innerHeight / 4);
    setIsVisible(shouldBeVisible);
  }, [size.mobile]);

  // Функция для прокрутки вверх
  const scrollToTop = useCallback(() => {
    const viewContainer = document.querySelector('.view');
    viewContainer?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Эффект для добавления слушателя события прокрутки
  useEffect(() => {
    const viewContainer = document.querySelector('.view');
    viewContainer?.addEventListener('scroll', handleScroll);

    return () => {
      viewContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Мемоизированное содержимое кнопки в зависимости от isVisible
  const buttonContent = useMemo(
    () => (
      <button className="button" onClick={scrollToTop} aria-label="Scroll to top">
        <ReactInlineSvg
          cacheRequests
          src={`${UI_IMAGES_PATH}/${size.mobile ? 'arrow__down' : 'scroll-down'}.${UI_IMAGES_FORMAT}`}
          style={{
            transform: 'rotate(180deg)',
          }}
          title="scroll-to-top-main"
        />
      </button>
    ),
    [size.mobile, scrollToTop],
  );

  // Возвращаем разметку компонента ScrollToTopButton
  return (
    <div className="scroll-to-top-button" data-visible={isVisible} style={style}>
      {buttonContent}
    </div>
  );
});
