import * as yup from 'yup';
// import dayjs from 'dayjs';
export const registrationSchema = yup
  .object({
    email: yup
      .string()
      .email('email_is_invalid')
      .when('$values', (values, schema) => {
        if (values[0]?.find((v) => v.id === 'email')?.require === 1) {
          return schema.required();
        }
      }),
    /*.test('email', 'Email is invalid', (item, context) => {
        console.log(context);
        if (context.parent.hasOwnProperty('email')) {
          return !!item;
        }
      })*/ password: yup.string().required('password_provided').min(6, 'password_short_6'),
    // Need later
    /*startTime: yup
      .date()
      .nullable()
      .required()
      .test({
        name: 'max',
        exclusive: false,
        params: {},
        message: 'Start date can’t be in the future',
        test: function (value, _context) {
          return dayjs(new Date(), 'MM-YYYY').isAfter(dayjs(value, 'MM-YYYY'));
        },
      }),
    endTime: yup
      .date()
      .nullable()
      .required()
      .test({
        name: 'max',
        exclusive: false,
        params: {},
        message: 'End date can’t be in the future',
        test: function (value, _context) {
          return dayjs(new Date(), 'MM-YYYY').isAfter(dayjs(value, 'MM-YYYY'));
        },
      })
      .test({
        name: 'min',
        exclusive: false,
        params: {},
        message: "end date can't be earlier than start date",
        test: function (value, context) {
          return dayjs(value, 'MM-YYYY').isAfter(dayjs(context.parent.startTime, 'MM-YYYY'));
        },
      }),*/
  })
  .required();
