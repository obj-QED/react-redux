import React from 'react';
import { useSelector } from 'react-redux';

import ReactInlineSvg from 'react-inlinesvg';
import { translateField } from '../../shared/utils';
import { useCopyClipboard } from '../../hooks';

import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';

const copyIcon = `${UI_IMAGES_PATH}copy.${UI_IMAGES_FORMAT}`;

export const CopyToClipboard = ({ text, id }) => {
  const words = useSelector((state) => state.words);
  const [copyFieldMessage, copyToClipboard] = useCopyClipboard();

  return (
    <span className="copy-clipboard-button" onClick={() => copyToClipboard(text)}>
      <ReactInlineSvg cacheRequests src={copyIcon} title="copy" />
      {copyFieldMessage && copyFieldMessage[id] && (
        <div className="copy-clipboard-button_message">{translateField(Boolean(copyFieldMessage[id]) && copyFieldMessage[id], words, false)}</div>
      )}
    </span>
  );
};
