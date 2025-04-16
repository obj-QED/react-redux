import { useState } from 'react';
import { useSelector } from 'react-redux';
import { LiveChatWidget } from '@livechat/widget-react';

import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../shared/imagePathes';

const livechatIcon = `${SOCIAL_IMAGES_PATH}support--menu_livechat.${SOCIAL_IMAGES_FORMAT}`;

export const Livechat = () => {
  const [visibility, setVisibility] = useState(false);
  const livechatId = useSelector((state) => state.api.supportNetworks?.chat2);
  // const livechatId = '19020147';

  const clickHandler = () => {
    setVisibility((prev) => !prev);
  };

  const onVisibilityChanged = (data) => {
    if (data?.visibility === 'minimized') setVisibility(false);
  };

  if (!livechatId) return null;

  return (
    <>
      <div className="support-method" onClick={clickHandler}>
        <img
          src={livechatIcon}
          alt="livechat"
          onError={(e) => {
            e.target.onerror = null;
            e.target.parentNode.remove();
          }}
        />
      </div>
      <LiveChatWidget key={livechatId} license={livechatId} visibility={visibility ? 'maximized' : 'hidden'} onVisibilityChanged={onVisibilityChanged} />
    </>
  );
};
