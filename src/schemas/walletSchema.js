import * as yup from 'yup';
import WAValidator from 'multicoin-address-validator';

export const walletSchema = yup.object().shape({
  wallet_address: yup
    .string()
    .required('wallet_address_required')
    .test('wallet_address_valid', 'Invalid wallet address', async function (value) {
      const { coin, name } = this.options.context;
      const symbol = name?.split(' ')[1];
      const nameCoin = coin || symbol;

      const isValid = WAValidator.validate(value, nameCoin.toLowerCase());
      if (!isValid && nameCoin) {
        return this.createError({ message: 'invalid_wallet_address' });
      }
      return true;
    }),
  name: yup
    .string()
    .required('name_required')
    .matches(/^[a-zA-Z]+$/, 'Only Latin letters are allowed')
    .min(1, 'Must have at least 1 character')
    .max(15, 'Must have at most 15 characters'),
  lastName: yup
    .string()
    .required('last_name_required')
    .matches(/^[a-zA-Z]+$/, 'Only Latin letters are allowed')
    .min(1, 'Must have at least 1 character')
    .max(15, 'Must have at most 15 characters'),
  fullName: yup
    .string()
    .required('full_name_required')
    .matches(/^[a-zA-Z ]+$/, 'Only Latin letters and space are allowed'),
  phone: yup.string(),
  email: yup.string().email('email_invalid').required('email_required'),
  postCode: yup.string().required('post_code_required').matches(/^\d+$/, 'Only digits are allowed'),
  tax_id: yup.string().required('tax_id_required').matches(/^\d+$/, 'Only digits are allowed'),
  pay_id_number: yup.string().required('pay_id_number_required').matches(/^\d+$/, 'Only digits are allowed'),
  pix_key: yup
    .string()
    .required('pix_key_required')
    .matches(/^[\d.-]+$/, 'Only digits, dot, and dash are allowed')
    .test('pix_key_length', 'Invalid pix key length', function (value) {
      if (value === undefined) return true;
      else if (value === null) return this.createError({ message: 'pix_key_required' });
      else if (value === '') return this.createError({ message: 'pix_key_required' });
      else if (value.length < 14) return this.createError({ message: 'Invalid pix key length' });
      else return true;
    }),
  card_holder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'Only Latin letters and space are allowed'),
  cardHolder: yup
    .string()
    .required('card_holder_required')
    .matches(/^[a-zA-Z ]+$/, 'Only Latin letters and space are allowed'),
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
        return this.createError({ message: 'Only Visa cards are accepted' });
      }
      if (card === 'mastercard' && !(value?.startsWith('51') || value?.startsWith('52') || value?.startsWith('53') || value?.startsWith('54') || value?.startsWith('55'))) {
        return this.createError({ message: 'Only Mastercard cards are accepted' });
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
      // Проверяем длину номера карты
      if (cleanedValue?.length !== expectedLength) {
        return this.createError({ message: `Expected ${expectedLength} characters for ${card ?? 'you'} card number` });
      }

      // Проверяем тип карты
      if (card === 'visa' && !value?.startsWith('4')) {
        return this.createError({ message: 'Only Visa cards are accepted' });
      }
      if (card === 'mastercard' && !(value?.startsWith('51') || value?.startsWith('52') || value?.startsWith('53') || value?.startsWith('54') || value?.startsWith('55'))) {
        return this.createError({ message: 'Only Mastercard cards are accepted' });
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
