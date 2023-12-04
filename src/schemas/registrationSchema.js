// Импортируем библиотеку yup для валидации форм
import * as yup from 'yup';
// import dayjs from 'dayjs';

// Определяем схему валидации для объекта registrationSchema
export const registrationSchema = yup
  .object({
    // Указываем правила для поля 'email'
    email: yup
      .string()
      .email('email_is_invalid') // Пользовательское сообщение об ошибке для некорректного email
      .when('$values', (values, schema) => {
        // Условная валидация: если в $values есть элемент с id 'email' и require равен 1, то поле обязательно
        if (values[0]?.find((v) => v.id === 'email')?.require === 1) {
          return schema.required();
        }
      }),
    /*.test('email', 'Email is invalid', (item, context) => {
        console.log(context);
        if (context.parent.hasOwnProperty('email')) {
          return !!item;
        }
          // Указываем правила для поля 'password'
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
  .required(); // Главное правило: объект должен быть обязательным (не null или undefined)
