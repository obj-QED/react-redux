// import { useSelector } from 'react-redux';

import React from 'react';
import { Banner } from '../Banner/Banner';
// import { News } from './News/News';
// import { DepositBanner } from './DepositBanner/DepositBanner';

export const Banners = () => {
  // const size = useSelector((state) => state.handling.size);
  // const words = useSelector((state) => state.words);

  return (
    <Banner />
    // <div
    //   className="banners"
    //   style={{
    //     background: size.mobile
    //       ? 'url("/uploads/en_desktop_horizontal_small_dep.jpg") no-repeat center / cover'
    //       : 'url("/uploads/en_desktop_horizontal_background_dep.jpg") no-repeat center / cover',
    //   }}
    // >
    //   <Banner />
    //   <DepositBanner  title={translateField('enter_deposit', 'banner.deposit', words)} action={subtitle={translateField('action', 'banner.deposit', words)}} promo={translateField('promo', 'banner.deposit', words)}/>
    //   {!size.mobile && <News />}
    // </div>
  );
};
