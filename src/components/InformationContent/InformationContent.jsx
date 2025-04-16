import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { translateField } from '../../shared/utils';

const InformationContent = memo(({ title = false, content = false }) => {
  const info = useSelector((state) => state.meta);
  const words = useSelector((state) => state.words);
  const location = useLocation();
  const url = location.pathname;
  const pageData = info?.[url];

  const translatedTitle = useMemo(() => {
    return translateField(pageData?.title.replace(/ /g, '_'), 'pages', words, false);
  }, [pageData?.title, words]);

  const translatedContent = useMemo(() => {
    return { __html: pageData?.content ?? '' };
  }, [pageData?.content]);

  const isPageDataEmpty = useMemo(() => {
    return Object.values(pageData || {}).every((value) => value === '');
  }, [pageData]);

  if (!pageData || (!title && !content) || isPageDataEmpty) return null;

  return (
    <div className="information-content">
      {title && <h1 className="title">{translatedTitle}</h1>}
      {content && <div className="content" dangerouslySetInnerHTML={translatedContent} />}
    </div>
  );
});

export default InformationContent;
