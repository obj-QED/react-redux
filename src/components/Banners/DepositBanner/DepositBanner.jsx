import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactInlineSvg from 'react-inlinesvg';
import { Switch } from 'antd';

import { translateField } from '../../../shared/utils';
import { Input, ButtonsEl } from '../../../elements';
import { getWalletQuickAccess, onlinePaymentDepositRequest } from '../../../store/actions';

import { AnimatedPreloader } from '../../AnimatedPreloader/AnimatedPreloader';
import { CurrencySelect } from '../../../elements/CurrencySelect';
import { Loader } from '../../UserProfile/Info/InfoStyles';
import { UI_IMAGES_PATH, UI_IMAGES_FORMAT } from '../../../shared/imagePathes';
import { Text } from './DepositBannerStyles';

export const DepositBanner = ({ title, deposit, bonus, action, payments, promo }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const words = useSelector((state) => state.words);

  const token = localStorage.getItem('user-token');
  const payment = useSelector((state) => state.payment?.onlinePaymentDeposit);
  const depositBanner = useSelector((state) => state.api.page.depositBanner);
  const currencies = Object.keys(depositBanner);
  const [amount, setAmount] = useState(deposit?.amount);
  const [currency, setCurrency] = useState(currencies[0]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    payment && setLoading(false);
    payment?.url && window.open(payment?.url, '_blank');
  }, [payment]);

  const onSwitchChange = () => {
    setChecked((checked) => !checked);
  };
  const handleChangeDeposit = (e) => {
    setAmount(e.target.value);
  };
  const handleChangeCurrency = (e) => {
    setCurrency(e.target.value);
  };
  const handleActionClick = () => {
    if (token && token !== 'undefined') {
      setLoading(true);
      dispatch(onlinePaymentDepositRequest({ cmd: 'onlinePayment', action: 'deposit', amount, bonusNeed: +checked, methodId: +depositBanner[currency][0]?.methodId }));
      dispatch(getWalletQuickAccess(currency));
    } else navigate('/auth');
  };
  const handlePromoClick = () => {
    if (token && token !== 'undefined') {
      navigate('/profile?tab=bonuses');
    } else navigate('/auth');
  };

  const displayRange = (data, inputValue) => {
    let textInRange = null;

    for (let i = 0; i < data.length - 1; i++) {
      const currentFrom = data[i].from;
      const nextFrom = data[i + 1].from;

      if (inputValue >= currentFrom && inputValue < nextFrom) {
        textInRange = data[i].info;
        break;
      } else if (inputValue < data[0].from) {
        textInRange = 'No content for that sum.';
      } else {
        textInRange = data[i + 1].info;
      }
    }

    return (
      <div className="banner__deposit__bonus">
        <Text className="banner__deposit__bonus__text" icon={bonus.icon}>
          <div className="banner__deposit__bonus__title">{textInRange}</div>
        </Text>
        <Switch
          cacheRequests
          onChange={onSwitchChange}
          checked={checked}
          className="banner__deposit__bonus__switch"
          checkedChildren={<ReactInlineSvg className="banner__deposit__bonus__switch-icon-svg" src={`${UI_IMAGES_PATH}banners/switch-checked.${UI_IMAGES_FORMAT}`} />}
        />
      </div>
    );
  };

  const renderDepositBlock = (currency) => {
    if (depositBanner[currency]) {
      return displayRange(depositBanner[currency], amount);
    }
  };

  return (
    <div className="banner__deposit__container">
      <div className="banner__deposit">
        {payment?.qrCodes ? null : (
          <Fragment>
            <div className="banner__deposit__header">
              <span className="banner__deposit__header__title">{title}</span>
            </div>
            <div className="banner__deposit__currency">
              <div className="currency-wrapper">
                <Input
                  className={classNames('currency-input', {
                    'font-md-size': amount > 999999,
                    'font-sm-size': amount > 99999999999,
                  })}
                  placeholder={amount}
                  name="currency"
                  type="number"
                  onChange={handleChangeDeposit}
                />
              </div>
              <CurrencySelect className="banner__deposit__currency__select" selected={currency} currencies={currencies} onChange={handleChangeCurrency} />
            </div>
            {renderDepositBlock(currency)}
            <ButtonsEl className="banner__deposit__action" onClick={handleActionClick}>
              {loading ? (
                <Loader height="46px">
                  <AnimatedPreloader />
                </Loader>
              ) : (
                <Fragment>
                  <span className="banner__deposit__action__title">
                    {translateField('game_for', 'banner.deposit', words)} {currency}
                    {amount} {translateField('and', 'banner.deposit', words)}
                  </span>
                  <span className="banner__deposit__action__subtitle">{action?.subtitle}</span>
                </Fragment>
              )}
            </ButtonsEl>
            {payments?.length && (
              <div className="banner__deposit__payments">
                {payments.map((payment, i) => {
                  return (
                    <span className="banner__deposit__payments-item" key={payment + i}>
                      {payment}
                    </span>
                  );
                })}
              </div>
            )}
            <div className="banner__deposit__promo" onClick={handlePromoClick}>
              {promo}
            </div>
          </Fragment>
        )}
      </div>
    </div>
  );
};

DepositBanner.propTypes = {
  title: PropTypes.string,
  deposit: PropTypes.object,
  bonus: PropTypes.object,
  action: PropTypes.object,
  payments: PropTypes.array,
  promo: PropTypes.string,
};

DepositBanner.defaultProps = {
  title: 'Введи сумму депозита',
  deposit: { amount: '50' },
  bonus: { icon: 'icon_box' },
  action: { subtitle: 'Получить бонус' },
  payments: ['Visa', 'Master Card', 'Amex', 'PayPal'],
  promo: 'У меня есть промокод!',
};
