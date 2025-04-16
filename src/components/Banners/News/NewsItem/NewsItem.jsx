import React, { useMemo } from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { SOCIAL_IMAGES_PATH, SOCIAL_IMAGES_FORMAT } from '../../../shared/imagePathes';

import { Text, Label } from './NewsItemStyles';

export const NewsItem = ({ text, icon, supportNetworks, title, label, labelBackground, id }) => {
  const apiData = useSelector((state) => state.api);
  const iconElements = useMemo(() => {
    const icons = supportNetworks ? Object.keys(supportNetworks) : [];
    if (icons?.length > 0) {
      return icons.map((icon) => {
        switch (icon) {
          case 'jivosite':
            return (
              <div
                onClick={() => window?.jivo_api?.open()}
                className="news__item__icon"
                key={icon}
                style={{ backgroundImage: `url('${SOCIAL_IMAGES_PATH}${icon}.${SOCIAL_IMAGES_FORMAT}')` }}
              />
            );
          default:
            let link = typeof supportNetworks[icon] === 'string' ? supportNetworks[icon] : '';
            return (
              <a key={icon} className="support-method" target="_blank" rel="noopener noreferrer" href={link}>
                <div className="news__item__icon" key={icon} style={{ backgroundImage: `url('${SOCIAL_IMAGES_PATH}${icon}.${SOCIAL_IMAGES_FORMAT}')` }} />
              </a>
            );
        }
      });
    }

    return null;
  }, [supportNetworks]);
  return (
    <div className="news__item">
      {id === 1 && id === 2 && (
        <Text className="news__item__text" {...(icon && { icon })}>
          {text}&nbsp;
        </Text>
      )}
      {id === 2 && (
        <Text className="news__item__text" {...(icon && { icon })}>
          {Boolean(apiData?.gamesList?.new?.length) ? apiData?.gamesList?.new?.length : 0} new games
        </Text>
      )}
      {id === 3 && (
        <Text className="news__item__text" {...(icon && { icon })}>
          {Boolean(apiData?.jackpots.length) ? apiData?.jackpots?.length : 0} jackpots
        </Text>
      )}
      <div className="news__item__icons-wrapper">{iconElements}</div>
      {label && (
        <Label className="news__item__label" labelBackground={labelBackground}>
          {label}
        </Label>
      )}
      <div className="news__item__title">{title}</div>
    </div>
  );
};

NewsItem.propTypes = {
  id: PropTypes.number,
  text: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  supportNetworks: PropTypes.object,
  labelBackground: PropTypes.string,
};

NewsItem.defaultProps = {
  id: undefined,
  text: undefined,
  icon: undefined,
  title: undefined,
  label: undefined,
  supportNetworks: {},
  labelBackground: undefined,
};
