import * as yup from 'yup';
// import dayjs from 'dayjs';
export const settingsSchema = yup
  .object({
    oldPassword: yup.string().required('required'),
    newPassword: yup.string().min(6, 'password_short_6').required('password_provided'),
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'passwords_not_match')
      .min(6, 'password_short_8')
      .required('password_provided'),
  })
  .required();
