import React, { memo } from 'react';
import ReactInputMask from 'react-input-mask';

export const InputWithMask = memo(({ placeholder, value, onChange, type }) => {
  const getMask = (method) => {
    const paymentMethod = method?.toLowerCase();
    let mask = '9999 9999 9999 9999';

    if (paymentMethod?.includes('mastercard') || paymentMethod?.includes('visa')) {
      mask = '9999 9999 9999 9999'; // Маска для карт Visa/Mastercard
    } else if (paymentMethod?.includes('pix')) {
      mask = '999.999.999.99'; // Маска для Pix
    }
    return mask;
  };

  const getPlaceholder = (method) => {
    const paymentMethod = method?.toLowerCase();
    let placeholderValue = 'XXXX XXXX XXXX XXXX'; // По умолчанию для карт Visa/Mastercard

    if (paymentMethod?.includes('mastercard') || paymentMethod?.includes('visa')) {
      placeholderValue = 'XXXX XXXX XXXX XXXX'; // По умолчанию для карт Visa/Mastercard
    } else if (paymentMethod?.includes('pix')) {
      placeholderValue = 'XXX.XXX.XXX.XX'; // Для Pix
    }

    return placeholderValue;
  };

  return <ReactInputMask mask={getMask(type)} placeholder={placeholder || getPlaceholder(type)} value={value} onChange={onChange} />;
});
