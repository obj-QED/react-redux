import * as yup from 'yup';
import WAValidator from 'multicoin-address-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { defaultCountries } from 'react-international-phone';

export const baseSchema = {
  wallet_address: yup
    .string()
    .required('wallet_address_required')
    .test('wallet_address_valid', 'Invalid wallet address', async function (value) {
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

  name: yup
    .string()
    .required('name_required')
    .matches(/^[a-zA-Z]+$/, 'only_latin_letters_are_allowed')
    .min(1, 'Must have at least 1 character')
    .max(15, 'Must have at most 15 characters'),
  lastName: yup
    .string()
    .required('last_name_required')
    .matches(/^[a-zA-Z]+$/, 'only_latin_letters_and_space_are_allowed')
    .min(1, 'Must have at least 1 character')
    .max(15, 'Must have at most 15 characters'),
  fullName: yup
    .string()
    .required('full_name_required')
    .matches(/^[a-zA-Z ]+$/, 'only_latin_letters_and_space_are_allowed'),
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
    .matches(/^[\d.-]+$/, 'Only digits, dot, and dash are allowed')
    .test('pix_key_length', 'Invalid pix key length', function (value) {
      if (value === undefined) return true;
      else if (value === null) return this.createError({ message: 'pix_key_required' });
      else if (value === '') return this.createError({ message: 'pix_key_required' });
      else if (value.length < 14) return this.createError({ message: 'invalid_pix_key_length' });
      else return true;
    }),
  card_holder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'only_latin_letters_and_space_are_allowed'),
  cardHolder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'only_latin_letters_and_space_are_allowed'),
  cardNumber: yup
    .string()
    .required('card_number_required')
    .test('cardNumber_length', 'Invalid card number length', function (value) {
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
    .test('cardNumber_length', 'Invalid card number length', function (value) {
      const { card } = this.options.context;
      const cleanedValue = card === 'pix' ? value?.replace(/\W/g, '') : value?.replace(/\D/g, '');
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
      else if (isNaN(value)) return this.createError({ message: 'Invalid number' });
      else if (value < min) return this.createError({ message: `Minimum amount is ${min}` });
      else if (value > max) return this.createError({ message: `Max amount is ${max}` });
      else return true;
    }),
};

export const ProfileSchema = (fields) => {
  const shape = {};

  fields?.forEach((field) => {
    const fieldConfig = baseSchema[field?.id];
    if (Boolean(Number(field?.require))) {
      shape[field?.id] = fieldConfig ? fieldConfig.required(`${field?.id}_required`) : yup.string().required(`${field?.id}_required`);
    }
  });

  return yup.object().shape(shape);
};
