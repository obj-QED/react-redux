// Импортируем библиотеку yup для валидации форм
import * as yup from 'yup';

// Определяем схему валидации для объекта infoSchema
export const infoSchema = yup.object({
  // Указываем правила для поля 'email'
  email: yup
    .string()
    .email() // Проверка на корректность email
    .when('$values', (values, schema) => {
      // Условная валидация: если в $values есть элемент с id 'email' и require равен 1, то поле обязательно
      if (values[0]?.find((v) => v.id === 'email')?.require === 1) {
        return schema.required();
      }
    }),
});
