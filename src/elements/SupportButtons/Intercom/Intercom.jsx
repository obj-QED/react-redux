import { useEffect, useState, memo } from 'react';
import { useSelector } from 'react-redux';

import { useIntercom } from 'react-use-intercom';
import ReactInlineSvg from 'react-inlinesvg';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../shared/imagePathes';

import './Intercom.scss';

const intercomIcon = `${SOCIAL_IMAGES_PATH}auth_telegram.${SOCIAL_IMAGES_FORMAT}`;

const IntercomButton = () => {
  const { showNewMessage, hide } = useIntercom();
  const [chatOpened, setChatOpened] = useState(false);

  const handleNewMessages = () => {
    if (!chatOpened) {
      showNewMessage();
      setChatOpened(true);
    } else {
      hide();
      setChatOpened(false);
    }
  };

  return (
    <div className="intercom-method" onClick={handleNewMessages}>
      <ReactInlineSvg cacheRequests className="intercom-icon" src={intercomIcon} desciption="icon" />
    </div>
  );
};

export const Intercom = memo(() => {
  const intercom = useSelector((state) => state.api.supportNetworks?.intercom);
  const { boot } = useIntercom();

  useEffect(() => {
    if (intercom) {
      boot();
    }
  }, [boot, intercom]);

  if (!intercom) return null;

  return <IntercomButton />;
});
