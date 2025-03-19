import * as yup from 'yup';
import WAValidator from 'multicoin-address-validator';
import cardValidator from 'card-validator';

import { PhoneNumberUtil } from 'google-libphonenumber';
import { defaultCountries } from 'react-international-phone';

export const walletSchema = yup.object().shape({
  wallet_address: yup
    .string()
    .required('wallet_address_required')
    .test('wallet_address_valid', 'invalid_wallet_address', async function (value) {
      const { currency } = this.options.context;
      const nameCoin = currency?.toLowerCase();
      const searchCurrency = WAValidator.findCurrency(currency?.toLowerCase());
      if (Boolean(!searchCurrency)) return true;

      const isValid = WAValidator.validate(value, nameCoin.toLowerCase());
      if (!isValid && nameCoin) {
        return this.createError({ message: 'invalid_wallet_address' });
      }
      return true;
    }),

  ars_tax_id: yup
    .string()
    .required('ars_tax_id_required')
    .matches(/^[\d.-]+$/, 'only_digits_dot_and_dash_are_allowed'),
  ars_cbucvu: yup.string().required('ars_cbucvu_required').length(22, 'ars_cbucvu_must_be_22_characters').matches(/^\d+$/, 'ars_cbucvu_must_only_contain_digits'),
  ars_cbu: yup.string().required('ars_cbu_required').length(22, 'ars_cbu_must_be_22_characters').matches(/^\d+$/, 'ars_cbu_must_only_contain_digits'),
  name: yup.string().required('name_required').min(1, 'Must have at least 1 character').max(15, 'Must have at most 15 characters'),

  // sol_webpay: yup
  //   .string()
  //   .required('sol_webpay_required')
  //   .test('valid-digits', 'sol_webpay_invalid_required', function (value) {
  //     if (value.length !== 12) {
  //       return this.createError({ message: 'sol_webpay_invalid_digits' });
  //     }

  //     return true;
  //   }),

  // ars_cuit: yup
  //   .string()
  //   .required('ars_cuit_required')
  //   .test('valid-digits', 'ars_cuit_invalid_required', function (value) {
  //     if (value.length !== 10) {
  //       return this.createError({ message: 'ars_cuit_invalid_digits' });
  //     }

  //     return true;
  //   }),

  ars_cuit: yup
    .string()
    .required('ars_cuit_required')
    .matches(/^[\d-]+$/, 'ars_cuit_must_only_contain_digits_and_dashes')
    .test('exact-digits-count', 'ars_cuit_must_contain_exactly_11_digits', (value) => value?.replace(/-/g, '').length === 11),

  lastName: yup.string().required('last_name_required').min(1, 'Must have at least 1 character').max(15, 'Must have at most 15 characters'),
  fullName: yup.string().required('full_name_required'),
  phone: yup.string().test('phone_valid', 'phone_required', function (value) {
    const phoneUtil = PhoneNumberUtil.getInstance();
    const isPhoneValid = (phone) => {
      try {
        return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
      } catch (error) {
        return false;
      }
    };
    const listCode = defaultCountries.map((item) => item[2]);
    const hasCountryCodeOnly = listCode.some((code) => value === `+${code}`); // Only the country code
    const hasValidCountryCode = value && value.startsWith('+') && listCode.some((code) => value.startsWith(`+${code}`)); // Country code with additional characters

    if (!value) {
      return this.createError({ message: 'phone_required' });
    } else if (hasCountryCodeOnly) {
      return this.createError({ message: 'phone_required' });
    } else if (!hasValidCountryCode) {
      return this.createError({ message: 'phone_required' });
    } else if (!value.startsWith('+55') && !isPhoneValid(value)) {
      return this.createError({ message: 'invalid_phone_number' });
    } else {
      return true;
    }
  }),
  email: yup.string().email('email_invalid').required('email_required'),
  postCode: yup.string().required('post_code_required').matches(/^\d+$/, 'only_digits_are_allowed'),
  tax_id: yup.string().required('tax_id_required').matches(/^\d+$/, 'only_digits_are_allowed'),
  pay_id_number: yup.string().required('pay_id_number_required').matches(/^\d+$/, 'only_digits_are_allowed'),
  pix_key: yup
    .string()
    .required('pix_key_required')
    .matches(/^[\d.-]+$/, 'only_digits_dot_and_dash_are_allowed')
    .test('pix_key_length', 'invalid_pix_key_length', function (value) {
      if (value === undefined) return true;
      else if (value === null) return this.createError({ message: 'pix_key_required' });
      else if (value === '') return this.createError({ message: 'pix_key_required' });
      else if (value.length < 14) return this.createError({ message: 'invalid_pix_key_length' });
      else return true;
    }),

  card_code: yup
    .string()
    .required('card_code_required')
    .test('is-correct-length', 'length_must_be_3_or_4_characters', (value) => !value || value.length === 3 || value.length === 4)
    .matches(/^\d+$/, 'only_digits_are_allowed'),

  card_cvv: yup
    .string()
    .required('card_code_required')
    .test('is-correct-length', 'length_must_be_3_or_4_characters', (value) => !value || value.length === 3 || value.length === 4)
    .matches(/^\d+$/, 'only_digits_are_allowed'),

  card_holder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'only_latin_letters_and_space_are_allowed'),
  card_expiry: yup
    .mixed()
    .required('card_expiry_required')
    .test('card_expiry_valid', 'invalid_card_expiry_date', function (value, context) {
      const currentDate = new Date();
      let allowedStartMonth = currentDate.getMonth() + 2; // Следующий месяц (индексация месяцев: 0 - январь)
      let allowedStartYear = currentDate.getFullYear();

      // Если переход на следующий год
      if (allowedStartMonth > 12) {
        allowedStartMonth = 1; // Январь следующего года
        allowedStartYear += 1;
      }

      let expiryMonth, expiryYear;

      if (typeof value === 'string') {
        // Проверка формата MM/YYYY
        const formatRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
        if (!formatRegex.test(value)) {
          return this.createError({ message: 'invalid_card_expiry_date' });
        }

        // Разделение на месяц и год
        const parts = value.split('/');
        expiryMonth = parseInt(parts[0], 10);
        expiryYear = parseInt(parts[1], 10);

        // Проверка валидности месяца и года
        if (!expiryMonth || expiryMonth < 1 || expiryMonth > 12 || !expiryYear || expiryYear < 2000) {
          return this.createError({ message: 'invalid_card_expiry_date' });
        }

        // Проверка на минимально допустимую дату
        if (expiryYear < allowedStartYear || (expiryYear === allowedStartYear && expiryMonth < allowedStartMonth)) {
          return this.createError({ message: 'invalid_card_expiry_date' });
        }
      } else {
        const { $M, $y } = context?.originalValue;
        if (!value) return false;

        const expiry = `${$M + 1}/${$y}`;
        const validation = cardValidator.expirationDate(expiry);

        if (!validation.isValid) {
          return this.createError({ message: 'invalid_card_expiry_date' });
        } else return true;
      }

      return true;
    }),

  cardHolder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'only_latin_letters_and_space_are_allowed'),
  cardNumber: yup
    .string()
    .required('card_number_required')
    .test('cardNumber_length', 'invalid_card_number_length', function (value) {
      const { card } = this.options.context;
      const cleanedValue = card === 'pix' ? value?.replace(/\W/g, '') : value?.replace(/\D/g, '');
      const expectedLength = card === 'pix' ? 11 : 16;

      // Проверяем длину номера карты
      if (cleanedValue?.length !== expectedLength) {
        return this.createError({ message: `Expected ${expectedLength} characters for ${card ?? 'you'} card number` });
      }

      // Проверяем тип карты
      if (card === 'visa' && !value?.startsWith('4')) {
        return this.createError({ message: 'only_visa_cards_are_accepted' });
      }
      if (card === 'mastercard' && !(value?.startsWith('51') || value?.startsWith('52') || value?.startsWith('53') || value?.startsWith('54') || value?.startsWith('55'))) {
        return this.createError({ message: 'only_mastercard_cards_are_accepted' });
      }

      return true;
    }),
  card_number: yup
    .string()
    .required('card_number_required')
    .test('cardNumber_length', 'invalid_card_number_length', function (value) {
      const { card } = this.options.context;
      const expectedLength = card === 'pix' ? 11 : 16;

      const valueLength = value.replace(/\s/g, '').length;

      // Проверяем длину номера карты
      if (valueLength !== expectedLength && valueLength !== expectedLength + 1) {
        return this.createError({ message: `Expected ${expectedLength} characters for ${card ?? 'you'} card number` });
      }

      // Проверяем тип карты
      if (card === 'visa' && !value?.startsWith('4')) {
        return this.createError({ message: 'only_visa_cards_are_accepted' });
      }
      if (card === 'mastercard' && !(value?.startsWith('51') || value?.startsWith('52') || value?.startsWith('53') || value?.startsWith('54') || value?.startsWith('55'))) {
        return this.createError({ message: 'only_mastercard_cards_are_accepted' });
      }

      return true;
    }),
  amount: yup
    .mixed({
      min: 0,
    })
    .required('amount_required')
    .test('amount_min', 'Invalid amount length', function (value) {
      const { min, max } = this.options.context;
      if (value === undefined) return true;
      else if (value === null) return this.createError({ message: 'amount_required' });
      else if (value === '') return this.createError({ message: 'amount_required' });
      else if (isNaN(value)) return this.createError({ message: 'invalid_number' });
      else if (value < min) return this.createError({ message: `minimum_amount_is` });
      else if (value > max) return this.createError({ message: `max_amount_is` });
      else if (value === 0) return this.createError({ message: 'amount_required' });
      else return true;
    }),
});

export const pickFieldsFromSchema = (fields) => {
  const updatedSchema = yup.object().shape(
    fields.reduce((acc, field) => {
      if (!walletSchema.fields[field]) {
        acc[field] = yup.string().required(`${field}_required`);
      } else {
        acc[field] = walletSchema.fields[field];
      }
      return acc;
    }, {}),
  );

  return updatedSchema;
};
