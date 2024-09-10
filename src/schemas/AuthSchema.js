import * as yup from 'yup';
import * as EmailValidator from 'email-validator';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { defaultCountries } from 'react-international-phone';

export const baseSchema = {
  login: yup.string(),
  email: yup.string().test('email_invalid', 'Invalid email address', function (value) {
    if (value && value.startsWith('+')) {
      // Пропускаем проверку, если значение начинается с '+'
      return true;
    } else if (value && !EmailValidator.validate(value)) {
      // Проверяем корректность email только если значение не начинается с '+'
      return this.createError({ message: 'Invalid email address' });
    } else {
      return true; // Валидно, если нет значения или значение корректное
    }
  }),

  password: yup.string().test('password_valid', 'Invalid password', function (value) {
    if (value && value.length < 6) {
      return this.createError({ message: 'password_length' });
    } else if (!value) {
      return this.createError({ message: 'password_required' });
    } else {
      return true;
    }
  }),

  new_password: yup.string().test('password_valid', 'Invalid password', function (value) {
    if (value && value.length < 6) {
      return this.createError({ message: 'password_length' });
    } else if (!value) {
      return this.createError({ message: 'password_required' });
    } else {
      return true;
    }
  }),

  terms_checked: yup.boolean().oneOf([true], 'You must accept the terms and conditions.'),

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
    } else if (!isPhoneValid(value)) {
      return this.createError({ message: 'invalid_phone_number' });
    } else {
      return true;
    }
  }),
  code: yup.string().test('code_valid', 'Invalid code', function (value) {
    if (value && value.length < 4) {
      return this.createError({ message: 'code_length' });
    } else if (!value) {
      return this.createError({ message: 'code_required' });
    } else {
      return true;
    }
  }),
};

export const buildSchema = (fields) => {
  const shape = {};

  fields?.forEach((field) => {
    const fieldConfig = baseSchema[field?.id];
    if (Boolean(Number(field.require))) {
      shape[field?.id] = fieldConfig ? fieldConfig.required(`${field?.id}_required`) : yup.string().required(`${field?.id}_required`);
    }
  });

  return yup.object().shape(shape);
};
