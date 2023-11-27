import * as yup from 'yup';
// import dayjs from 'dayjs';
export const infoSchema = yup.object({
  email: yup
    .string()
    .email()
    .when('$values', (values, schema) => {
      if (values[0]?.find((v) => v.id === 'email')?.require === 1) {
        return schema.required();
      }
    }),
});
