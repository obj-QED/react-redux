import React from 'react';
import { useDispatch } from 'react-redux';
import ReactInlineSvg from 'react-inlinesvg';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../../shared/imagePathes';

const imgSrc = `${SOCIAL_IMAGES_PATH}auth_whatsapp.${SOCIAL_IMAGES_FORMAT}`;

export const WhatsappAuth = ({ clickHandler, current }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch({
      type: 'SOCIAL_AUTH_TYPE',
      payload: current,
    });

    if (clickHandler) {
      clickHandler();
    }
  };

  return (
    <div className="whatsapp-auth social-button" onClick={handleClick}>
      <ReactInlineSvg src={imgSrc} desciption="whatsapp" cacheRequests />
    </div>
  );
};
