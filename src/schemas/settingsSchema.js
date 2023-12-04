// Импортируем библиотеку yup для валидации форм
import * as yup from 'yup';

// Определяем схему валидации для объекта settingsSchema
export const settingsSchema = yup
  .object({
    // Указываем правила для поля 'oldPassword'
    oldPassword: yup.string().required('required'), // Пользовательское сообщение об ошибке для пустого старого пароля

    // Указываем правила для поля 'newPassword'
    newPassword: yup.string().min(6, 'password_short_6').required('password_provided'), // Пользовательские сообщения об ошибках для короткого нового пароля и пустого нового пароля

    // Указываем правила для поля 'repeatPassword'
    repeatPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'passwords_not_match') // Пользовательское сообщение об ошибке, если повтор пароля не совпадает с новым паролем
      .min(6, 'password_short_8') // Пользовательское сообщение об ошибке для короткого повтора пароля
      .required('password_provided'), // Пользовательское сообщение об ошибке для пустого повтора пароля
  })
  .required(); // Главное правило: объект должен быть обязательным (не null или undefined)
